import React, { useEffect } from 'react';
import { fetchAgentState } from '../api/api.js';
import { useStore } from '../api/store';

const InternalMonologue = () => {
  const { agentState, setAgentState, selectedProject } = useStore((state) => ({
    agentState: state.agentState,
    setAgentState: state.setAgentState,
    selectedProject: state.selectedProject,
  }));

  useEffect(() => {
    async function getAgentState() {
      if (selectedProject) {
        await fetchAgentState();
      } else {
        // If no project is selected, set agent state to standby or default
        setAgentState({ internal_monologue: 'on Standby' });
      }
    }
    getAgentState();
  }, [selectedProject, setAgentState]); // Depend on selectedProject to refetch agent state on change

  return (
    <div
      className="internal-monologue border-2 flex items-start gap-2 px-2 py-2 rounded-lg"
      style={{ borderColor: '#373737', backgroundColor: '#1E1E1E' }}
    >
      <img
        src="/assets/ana.png"
        alt="ANA's Avatar"
        className="avatar rounded-full flex-shrink-0"
      />
      <div className="flex flex-col w-full gap-1 text-left p-2">
        <p className="text-xs text-gray-400">
          {selectedProject ? (
            agentState !== null && (agentState.agent_is_active ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-orange-600">Inactive</span>
            ))
          ) : (
            <span className="text-gray-400">on Standby</span>
          )}
        </p>
        <p className="text-xs message-text" style={{ color: '#E0E0E0' }}>
          {selectedProject ? (
            agentState?.internal_monologue || 'on Standby'
          ) : (
            'Please select a project to view details'
          )}
        </p>
      </div>
      <style>
        {`
          .avatar {
            width: 40px;
            height: 40px;
          }
          .message-text a {
            color: #FFD700; /* Gold color for highlighting links */
            font-weight: bold; /* Bold font for links */
          }
        `}
      </style>
    </div>
  );
}

export default InternalMonologue;
