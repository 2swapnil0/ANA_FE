import React from 'react'
import '../css/BrowserWidget.css'

const BrowserWidget = () => {
  return (
    <div className="flex flex-col border-2 border-gray-700 rounded-lg h-1/2 overflow-y-auto OuterContainer">
  <div className="p-2 flex items-center border-b border-gray-700 InnerContainer"> 
    <div className="flex space-x-2 ml-2 mr-4">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
    </div>
    <input
      type="text"
      id="browser-url"
      className="flex-grow border-2 rounded-lg p-2 overflow-x-auto bg-col1 border-gray-700 OuterContainer"
      placeholder="ana://newtab"
      // value={$agentState?.browser_session.url || ""}
    />
  </div>
  {/* <div id="browser-content" className="flex-grow overflow-y-auto">
    {#if $agentState?.browser_session.screenshot}
      <img
        className="browser-img"
        alt="Browser snapshot"
        src={API_BASE_URL + "/api/get-browser-snapshot?snapshot_path=" + $agentState?.browser_session.screenshot}
      />
    {:else}
      <div className="text-gray-400 text-center mt-5" style="color: #E0E0E0;"><strong>ANA's Browser Interface</strong></div>
    {/if}
  </div> */}
</div>
  )
}

export default BrowserWidget
