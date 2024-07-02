//   import { useStore } from '../api/store.js'; 
//   const API_BASE_URL = 'https://preview-app.openana.ai:9013';

//   export async function fetchInitialData() {
//     const { setProjectList, setModelList, setSearchEngineList } = useStore.getState();

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/data`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setProjectList(data.projects);
//       setModelList(data.models);
//       setSearchEngineList(data.search_engines);
//       localStorage.setItem('defaultData', JSON.stringify(data));
//     } catch (error) {
//       console.error('Error fetching initial data:', error);
//     }
//   }

//   export async function fetchAgentState() {
//     const { setAgentState } = useStore.getState();
//     const projectName = localStorage.getItem('selectedProject');

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/get-agent-state`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ project_name: projectName }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setAgentState(data.state);
//     } catch (error) {
//       console.error('Error fetching agent state:', error);
//     }
//   }

//   export async function checkInternetStatus() {
//     const { setInternet } = useStore.getState();

//     if (navigator.onLine) {
//       setInternet(true);
//     } else {
//       setInternet(false);
//     }
//   }

//   export async function fetchMessages(projectName) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/messages`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ project_name: projectName }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data.messages;
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       return [];
//     }
//   }

// export async function executeAgent(prompt, baseModel, projectName) {
//   const response = await fetch(`${API_BASE_URL}/api/execute-agent`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       prompt,
//       baseModel,
//       project_name: projectName,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to execute agent');
//   }

//   return response.json();
// }
import { useStore } from '../api/store.js'; 
const API_BASE_URL = 'https://preview-app.openana.ai:9013';

export async function fetchInitialData() {
  const { setProjectList, setModelList, setSearchEngineList } = useStore.getState();

  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setProjectList(data.projects);
    setModelList(data.models);
    setSearchEngineList(data.search_engines);
    localStorage.setItem('defaultData', JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
}

export async function fetchAgentState() {
  const { setAgentState } = useStore.getState();
  const projectName = localStorage.getItem('selectedProject');

  try {
    const response = await fetch(`${API_BASE_URL}/api/get-agent-state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_name: projectName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAgentState(data.state);
  } catch (error) {
    console.error('Error fetching agent state:', error);
  }
}

export async function checkInternetStatus() {
  const { setInternet } = useStore.getState();

  if (navigator.onLine) {
    setInternet(true);
  } else {
    setInternet(false);
  }
}

export async function fetchMessages(projectName) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_name: projectName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function executeAgent(prompt, baseModel, projectName) {
  const response = await fetch(`${API_BASE_URL}/api/execute-agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      baseModel,
      project_name: projectName,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to execute agent');
  }

  return response.json();
}

export async function createProject(projectName) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_name: projectName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function deleteProject(projectName) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_name: projectName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
