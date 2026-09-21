If WScript.Arguments.Count < 3 Then
    WScript.Quit 87
End If

scriptPath = WScript.Arguments(0)
projectRoot = WScript.Arguments(1)
runtimeRoot = WScript.Arguments(2)

Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = runtimeRoot

command = """C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe""" & _
    " -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & scriptPath & """" & _
    " -ProjectRoot """ & projectRoot & """" & _
    " -RuntimeRoot """ & runtimeRoot & """"

exitCode = shell.Run(command, 0, True)
WScript.Quit exitCode
