---
name: voice-mode
description: "Adds speech-to-text and text-to-speech voice mode to the OpenCode desktop app on Windows. Use for 'voice mode', 'voice input', 'speech to text', 'talk to the agent'."
---

# ðŸŽ¤ Voice Mode â€” Add Speech-to-Text & Text-to-Speech to OpenCode

OpenCode (and its successor Crush) is a terminal-based AI assistant with **no built-in voice mode**. This skill shows you how to add voice input (speech-to-text) and voice output (text-to-speech) to your OpenCode desktop app on Windows.

---

## Option 1: MCP Speech Server (Recommended â€” works inside OpenCode)

Run a local MCP server that exposes STT (speech-to-text) and TTS (text-to-speech) tools, then add it to your `opencode.json` MCP config.

### 1. Install a speech MCP server

You can build a small one with Python, or use community MCP servers. Example with Python + `speech_recognition` + `pyttsx3`:

```bash
pip install speech_recognition pyttsx3 pyaudio
```

Create `~/.config/opencode/mcp-speech/server.py`:

```python
import speech_recognition as sr
import pyttsx3
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("speech")
recognizer = sr.Recognizer()
tts = pyttsx3.init()

@mcp.tool()
def stt() -> str:
    """Listen to microphone and return transcribed text."""
    with sr.Microphone() as source:
        audio = recognizer.listen(source, timeout=10, phrase_time_limit=60)
    return recognizer.recognize_google(audio)

@mcp.tool()
def tts(text: str) -> str:
    """Speak text aloud through system speakers."""
    tts.say(text)
    tts.runAndWait()
    return f"Spoke: {text[:80]}..."

if __name__ == "__main__":
    mcp.run()
```

### 2. Register it in `opencode.json`

Add to your `C:\Users\apuro\.config\opencode\opencode.json`:

```json
{
  "mcp": {
    "context7": { ... },
    "vercel": { ... },
    "speech": {
      "type": "stdio",
      "command": "python",
      "args": ["C:/Users/apuro/.config/opencode/mcp-speech/server.py"]
    }
  }
}
```

Restart OpenCode. You can then ask me to:
- `/voice listen` â€” transcribe your microphone and send it as a prompt
- `/voice speak <text>` â€” read a response aloud

---

## Option 2: Windows Built-in Speech (No code, OS-level)

Windows has built-in speech recognition and text-to-speech:

- **Speech-to-text**: Press `Win + H` to open voice dictation, speak, then paste into OpenCode's input.
- **Text-to-speech**: Use Windows Narrator (`Win + Ctrl + Enter`) to read OpenCode's responses, or use PowerShell:
  ```powershell
  Add-Type -AssemblyName System.Speech
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.Speak("Your response text here")
  ```

---

## Option 3: Browser Web Speech API

If you use OpenCode through a web interface, the browser's Web Speech API works natively:

```javascript
// Speech-to-text
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (e) => console.log(e.results[0][0].transcript);
recognition.start();

// Text-to-speech
const utterance = new SpeechSynthesisUtterance("Hello from OpenCode");
speechSynthesis.speak(utterance);
```

---

## Quick Voice Commands (add as OpenCode custom commands)

Create `C:\Users\apuro\.config\opencode\commands\voice-listen.md`:

```
Use the speech MCP server's stt tool to transcribe my microphone,
then send that text as my next message to you.
```

Create `C:\Users\apuro\.config\opencode\commands\voice-speak.md`:

```
Use the speech MCP server's tts tool to read aloud your last response.
```

Then press `Ctrl+K` in OpenCode to run them.

---

## Verification

1. Install Python deps: `pip install speech_recognition pyttsx3 pyaudio`
2. Create the MCP server file above
3. Add the `speech` MCP entry to `opencode.json`
4. Restart OpenCode
5. Test: ask me to "listen to my voice and transcribe it"

Base directory for this skill: C:\Users\apuro\.config\opencode\skills

