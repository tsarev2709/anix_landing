const fs = require('fs');
const defaultProtocol = require('../docs/geo/experiment-2026-09-14.json');
const fields = [
  'platform',
  'model',
  'mode',
  'personalization',
  'location',
  'phase',
  'wave',
];
function summarize(input, protocol = defaultProtocol) {
  if (
    input.protocolVersion !== protocol.version ||
    !Array.isArray(input.observations)
  )
    throw new Error('Invalid protocol or observations');
  const prompts = new Map(protocol.prompts.map((p) => [p.id, p])),
    groups = new Map(),
    seen = new Set();
  for (const row of input.observations) {
    if (
      !prompts.has(row.promptId) ||
      !protocol.platforms.includes(row.platform)
    )
      throw new Error('Unknown prompt or platform');
    if (
      !Number.isInteger(row.repeat) ||
      row.repeat < 1 ||
      row.repeat > protocol.repeatsPerPrompt
    )
      throw new Error('Invalid repeat');
    if (fields.some((k) => typeof row[k] !== 'string' || !row[k].trim()))
      throw new Error('Missing measurement conditions');
    const key = JSON.stringify(fields.map((k) => row[k])),
      runKey = key + '|' + row.promptId + '|' + row.repeat;
    if (seen.has(runKey)) throw new Error('Duplicate observation');
    seen.add(runKey);
    if (!['completed', 'blocked', 'error'].includes(row.status))
      throw new Error('Invalid status');
    if (row.status === 'completed') {
      if (row.prompt !== prompts.get(row.promptId).prompt)
        throw new Error('Changed prompt');
      if (
        !row.reviewed ||
        !row.answer?.trim() ||
        !row.capturedAt ||
        Number.isNaN(Date.parse(row.capturedAt)) ||
        !Array.isArray(row.citations)
      )
        throw new Error('Missing source answer');
      for (const k of ['mentionsAnix', 'recommendsAnix', 'identityCorrect'])
        if (typeof row[k] !== 'boolean')
          throw new Error('Missing adjudication');
      if (row.recommendsAnix && (!row.mentionsAnix || !row.identityCorrect))
        throw new Error('Recommendation requires the correct Anix entity');
      if (
        row.recommendedPosition !== null &&
        (!row.recommendsAnix ||
          !Number.isInteger(row.recommendedPosition) ||
          row.recommendedPosition < 1)
      )
        throw new Error('Invalid position');
      for (const url of row.citations)
        if (!['http:', 'https:'].includes(new URL(url).protocol))
          throw new Error('Invalid citation');
    }
    if (!groups.has(key))
      groups.set(key, {
        conditions: Object.fromEntries(fields.map((k) => [k, row[k]])),
        rows: [],
      });
    groups.get(key).rows.push(row);
  }
  const rate = (n, d) => (d ? n / d : null);
  function metrics(rows, expected) {
    const valid = rows.filter((r) => r.status === 'completed'),
      n = valid.length;
    const mentioned = valid.filter((r) => r.mentionsAnix),
      recommended = valid.filter((r) => r.recommendsAnix);
    const cited = valid.filter((r) =>
      r.citations.some((url) => new URL(url).hostname === 'studio.anix-ai.pro')
    );
    const targetCited = valid.filter((r) => {
      const target = prompts.get(r.promptId)?.targetUrl;
      if (!target) return false;
      return r.citations.some((url) => {
        const parsed = new URL(url);
        return (
          parsed.hostname === 'studio.anix-ai.pro' &&
          parsed.pathname.replace(/\/+$/, '') === target.replace(/\/+$/, '')
        );
      });
    });
    const boundaryReviewed = mentioned.filter(
      (r) => typeof r.boundaryAccurate === 'boolean'
    );
    const hallucinationReviewed = mentioned.filter(
      (r) => typeof r.hasHallucination === 'boolean'
    );
    return {
      expected,
      recorded: rows.length,
      measured: n,
      missing: expected - n,
      coverage: rate(n, expected),
      mentions: mentioned.length,
      mentionRate: rate(mentioned.length, n),
      recommendations: recommended.length,
      recommendationRate: rate(recommended.length, n),
      citedAnswers: cited.length,
      citationRate: rate(cited.length, n),
      targetCitedAnswers: targetCited.length,
      targetCitationRate: rate(targetCited.length, n),
      top3Recommendations: recommended.filter(
        (r) => r.recommendedPosition !== null && r.recommendedPosition <= 3
      ).length,
      correctIdentityRate: rate(
        mentioned.filter((r) => r.identityCorrect).length,
        mentioned.length
      ),
      boundaryAccuracyRate: rate(
        boundaryReviewed.filter((r) => r.boundaryAccurate).length,
        boundaryReviewed.length
      ),
      hallucinationRate: rate(
        hallucinationReviewed.filter((r) => r.hasHallucination).length,
        hallucinationReviewed.length
      ),
      status:
        n === 0 ? 'not_measured' : n === expected ? 'complete' : 'partial',
    };
  }
  const expectedPerPlatform =
    protocol.prompts.length * protocol.repeatsPerPrompt;
  return {
    protocolVersion: protocol.version,
    status: input.observations.some((r) => r.status === 'completed')
      ? 'measured'
      : 'not_measured',
    expectedPerPlatform,
    expectedTotal: expectedPerPlatform * protocol.platforms.length,
    groups: [...groups.values()].map((g) => ({
      conditions: g.conditions,
      all: metrics(g.rows, expectedPerPlatform),
      clusters: Object.fromEntries(
        [...new Set(protocol.prompts.map((p) => p.cluster))].map((c) => {
          const promptCount = protocol.prompts.filter(
            (p) => p.cluster === c
          ).length;
          return [
            c,
            metrics(
              g.rows.filter((r) => prompts.get(r.promptId).cluster === c),
              promptCount * protocol.repeatsPerPrompt
            ),
          ];
        })
      ),
    })),
    note: 'Fixed sample only. Missing access is not zero visibility. Compare identical conditions; one wave does not prove causality.',
  };
}
module.exports = { summarize };
if (require.main === module) {
  if (!process.argv[2])
    throw new Error(
      'Usage: node scripts/summarize-geo-experiment.js observations.json [protocol.json]'
    );
  const protocol = process.argv[3]
    ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8'))
    : defaultProtocol;
  console.log(
    JSON.stringify(
      summarize(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')), protocol),
      null,
      2
    )
  );
}
