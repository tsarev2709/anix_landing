# YouTube embed compatibility

The non-Russian showreel uses the regular `www.youtube.com/embed` player rather than `youtube-nocookie.com`, so an existing YouTube browser session can be reused when the browser permits it.

The embed includes the production `origin` parameter and a direct `youtu.be` fallback link. The iframe is still created only after the visitor presses the showreel poster.
