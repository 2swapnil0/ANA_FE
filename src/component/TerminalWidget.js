import React, { useEffect, useRef, useState } from 'react';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useStore } from "../api/store";
import '../css/TerminalWidget.css'; // Adjust the import path as needed

const TerminalWidget = () => {
  const agentState = useStore(state => state.agentState);
  const terminalRef = useRef(null);
  const [terminal, setTerminal] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);

  useEffect(() => {
    if (terminalRef.current) {
      const term = new Terminal({
        disableStdin: true,
        cursorBlink: true,
        convertEol: true,
        theme: {
          background: "#121212", // Primary Background
          foreground: "#E0E0E0", // Text and Icons
          cursor: "#03DAC6", // Accent Color
        },
      });

      const fitAddonInstance = new FitAddon();
      term.loadAddon(fitAddonInstance);
      term.open(terminalRef.current);
      fitAddonInstance.fit();

      setTerminal(term);
      setFitAddon(fitAddonInstance);
    }

    const handleResize = () => {
      if (fitAddon) {
        fitAddon.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (terminal) {
        terminal.dispose();
      }
    };
  }, [terminalRef.current]); // Ensure the effect runs only when terminalRef is available

  useEffect(() => {
    if (!terminal || !fitAddon) return;

    const agentStateSubscription = (state) => {
      if (state && state.terminal_session) {
        const command = state.terminal_session.command || '';
        const output = state.terminal_session.output || "";
        const title = state.terminal_session.title || "Ana's Terminal";

        addCommandAndOutput(command, output, title);
      } else {
        terminal.reset();
      }

      fitAddon.fit();
      scrollToBottom();
    };

    // Assuming agentState is updated correctly
    agentStateSubscription(agentState);

    return () => {
      // Clean-up function
    };
  }, [agentState, terminal, fitAddon]);

  const addCommandAndOutput = (command, output, title) => {
    if (title) {
      document.getElementById("terminal-title").innerText = title;
    }
    terminal.reset();
    terminal.write(`ana@ana-sandbox % ${command}\r\n\r\n${output}\r\n`);
    fitAddon.fit(); // Ensure terminal fits after adding content
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight);
    }
  };

  return (
    <div className="flex flex-col border-2 rounded-lg h-1/2 OuterContainer">
      <div className="p-2 flex items-center border-b InnerContainer">
        <div className="flex space-x-2 ml-1 mr-2"> {/* Adjusted margins */}
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex justify-between w-full items-center">
          <span id="terminal-title">Ana's Terminal</span>
        </div>
      </div>
      <div
        id="terminal-content"
        className="h-full w-full rounded-bl-lg text-left"
        style={{ backgroundColor: '#1e1e1e', overflowY: 'auto', padding: 0 }} // Adjusted styling
        ref={terminalRef}
      ></div>
    </div>
  );
};

export default TerminalWidget;
