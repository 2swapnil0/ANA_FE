import React from 'react';
import ControlPanel from '../component/ControlPanel.js';
import MessageContainer from '../component/MessageContainer.js';
import InternalMonologue from '../component/InternalMonologue.js';
import MessageInput from '../component/MessageInput.js';
import BrowserWidget from '../component/BrowserWidget.js';
import TerminalWidget from '../component/TerminalWidget.js';

const SecondaryLayout = () => {
  return (
      <div className="flex space-x-4 h-full overflow-y-auto">
        <div className="flex flex-col gap-2 w-1/2">
          <MessageContainer />
          <InternalMonologue />
          <MessageInput />
        </div>
        <div className="flex flex-col gap-4 w-1/2">
          <BrowserWidget />
          <TerminalWidget />
        </div>
      </div>
  );
};

export default SecondaryLayout;
