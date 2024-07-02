import create from 'zustand';

export const useStore = create((set) => ({
  projectList: [],
  modelList: {},
  searchEngineList: [],
  agentState: null,
  internet: true,
  selectedProject: null,
  messages: [],
  
  setSelectedProject: (projectName) => set({ selectedProject: projectName }),
  setProjectList: (projects) => set({ projectList: projects }),
  setModelList: (models) => set({ modelList: models }),
  setSearchEngineList: (searchEngines) => set({ searchEngineList: searchEngines }),
  setAgentState: (state) => set({ agentState: state }),
  setInternet: (status) => set({ internet: status }),
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));

export const actions = {
  addProject: (newProject) => useStore.setState((state) => ({
    projectList: [...state.projectList, newProject]
  })),
  
  removeProject: (projectName) => useStore.setState((state) => ({
    projectList: state.projectList.filter(project => project !== projectName)
  })),
};
