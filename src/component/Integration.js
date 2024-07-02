import React, { useState, useEffect } from 'react';
import axios from 'axios';

const githubClientID = 'Ov23licHVDaiZxf7uvSO';
const bitbucketClientID = 'FrYRd7VeRKjKJMBQRV';
const gitlabClientID = '4c9d2f13c31c8c243090b7f49ceba01d61a53fef88cb8cb9a684da940cc50117';
const confluenceClientID = 'etsDwVZBcoS0jNgkNxznERWjlXbFrf3L';
const githubRedirectURI = 'http://localhost:5000/oauth/github/callback';
const gitlabRedirectURI = 'http://localhost:5000/oauth/gitlab/callback';
const bitbucketRedirectURI = 'http://localhost:5000/oauth/bitbucket/callback';
const confluenceRedirectURI = 'http://localhost:5000/oauth/confluence/callback';

const Integration = () => {
  const [githubRepos, setGithubRepos] = useState([]);
  const [gitlabRepos, setGitlabRepos] = useState([]);
  const [bitbucketRepos, setBitbucketRepos] = useState([]);
  const [confluencePages, setConfluencePages] = useState([]);
  const [githubConnected, setGithubConnected] = useState(false);
  const [gitlabConnected, setGitlabConnected] = useState(false);
  const [bitbucketConnected, setBitbucketConnected] = useState(false);
  const [confluenceConnected, setConfluenceConnected] = useState(false);
  const [selectedGithubRepo, setSelectedGithubRepo] = useState(null);
  const [selectedGitlabRepo, setSelectedGitlabRepo] = useState(null);
  const [selectedBitbucketRepo, setSelectedBitbucketRepo] = useState(null);
  const [selectedConfluencePage, setSelectedConfluencePage] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    const provider = urlParams.get('provider');

    if (token && provider) {
      localStorage.setItem(`${provider}Token`, token);
      window.history.replaceState({}, document.title, "/");
      switch (provider) {
        case 'github':
          setGithubConnected(true);
          fetchGithubRepos(token);
          break;
        case 'gitlab':
          setGitlabConnected(true);
          fetchGitlabRepos(token);
          break;
        case 'bitbucket':
          setBitbucketConnected(true);
          fetchBitbucketRepos(token);
          break;
        case 'confluence':
          setConfluenceConnected(true);
          fetchConfluencePages(token);
          break;
        default:
          break;
      }
    } else {
      checkLocalStorageTokens();
    }
  }, []);

  const checkLocalStorageTokens = () => {
    const githubToken = localStorage.getItem('githubToken');
    const gitlabToken = localStorage.getItem('gitlabToken');
    const bitbucketToken = localStorage.getItem('bitbucketToken');
    const confluenceToken = localStorage.getItem('confluenceToken');
    
    if (githubToken) {
      setGithubConnected(true);
      fetchGithubRepos(githubToken);
    }
    if (gitlabToken) {
      setGitlabConnected(true);
      fetchGitlabRepos(gitlabToken);
    }
    if (bitbucketToken) {
      setBitbucketConnected(true);
      fetchBitbucketRepos(bitbucketToken);
    }
    if (confluenceToken) {
      setConfluenceConnected(true);
      fetchConfluencePages(confluenceToken);
    }
  };

  const handleConnect = (provider) => {
    if (!getConnectedState(provider)) {
      let authURL;
      switch (provider) {
        case 'github':
          authURL = `https://github.com/login/oauth/authorize?client_id=${githubClientID}&redirect_uri=${githubRedirectURI}&scope=repo`;
          break;
        case 'gitlab':
          authURL = `https://gitlab.com/oauth/authorize?client_id=${gitlabClientID}&redirect_uri=${gitlabRedirectURI}&response_type=code&scope=api read_api`;
          break;
        case 'bitbucket':
          authURL = `https://bitbucket.org/site/oauth2/authorize?client_id=${bitbucketClientID}&response_type=code&redirect_uri=${bitbucketRedirectURI}&scope=repository`;
          break;
        case 'confluence':
          authURL = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${confluenceClientID}&scope=read:confluence-content.all&redirect_uri=${confluenceRedirectURI}&state=123&response_type=code&prompt=consent`;
          break;
        default:
          break;
      }
      window.location.href = authURL;
    } else {
      disconnectProvider(provider);
    }
  };

  const disconnectProvider = (provider) => {
    switch (provider) {
      case 'github':
        setGithubConnected(false);
        setGithubRepos([]);
        localStorage.removeItem('githubToken');
        break;
      case 'gitlab':
        setGitlabConnected(false);
        setGitlabRepos([]);
        localStorage.removeItem('gitlabToken');
        break;
      case 'bitbucket':
        setBitbucketConnected(false);
        setBitbucketRepos([]);
        localStorage.removeItem('bitbucketToken');
        break;
      case 'confluence':
        setConfluenceConnected(false);
        setConfluencePages([]);
        localStorage.removeItem('confluenceToken');
        break;
      default:
        break;
    }
  };

  const fetchGithubRepos = async (token) => {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGithubRepos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
    }
  };

  const fetchGitlabRepos = async (token) => {
    try {
      const response = await fetch('https://gitlab.com/api/v4/projects?owned=true', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGitlabRepos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching GitLab repositories:', error);
    }
  };

  const fetchBitbucketRepos = async (token) => {
    try {
      const response = await fetch('https://api.bitbucket.org/2.0/repositories?role=member', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBitbucketRepos(data.values || []);
    } catch (error) {
      console.error('Error fetching Bitbucket repositories:', error);
    }
  };

  const fetchConfluencePages = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/confluence/wiki/rest/api/content?type=page&token=${token}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Confluence pages:', data);
      setConfluencePages(data.results || []);
    } catch (error) {
      console.error('Error fetching Confluence pages:', error);
    }
  };
  
  
  

  const getConnectedState = (provider) => {
    switch (provider) {
      case 'github':
        return githubConnected;
      case 'gitlab':
        return gitlabConnected;
      case 'bitbucket':
        return bitbucketConnected;
      case 'confluence':
        return confluenceConnected;
      default:
        return false;
    }
  };

  const handleRepoChange = (provider, repo) => {
    switch (provider) {
      case 'github':
        setSelectedGithubRepo(repo);
        break;
      case 'gitlab':
        setSelectedGitlabRepo(repo);
        break;
      case 'bitbucket':
        setSelectedBitbucketRepo(repo);
        break;
      default:
        break;
    }
  };

  const renderRepoDropdown = (provider, repos, selectedRepo, handleRepoChange) => {
    return (
      <div className="repo-dropdown">
        <select
          value={selectedRepo ? selectedRepo.id : ''}
          onChange={(e) => handleRepoChange(provider, repos.find(repo => repo.id === parseInt(e.target.value)))}
        >
          <option value="">Select a repository</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div>
      <h1>Integration Dashboard</h1>
      <section className="integration-section">
        <div className={`integration-card ${githubConnected ? 'connected' : ''}`}>
          <img src="../assets/github.png" alt="GitHub Logo" className="logo" />
          <div className="info">
            <h2>GitHub</h2>
            <p>A web-based platform for version control and collaboration.</p>
          </div>
          <button className="connect-btn" onClick={() => handleConnect('github')}>
            {getConnectedState('github') ? 'Disconnect' : 'Connect'}
          </button>
          {githubConnected && renderRepoDropdown('github', githubRepos, selectedGithubRepo, handleRepoChange)}
        </div>

        <div className={`integration-card ${gitlabConnected ? 'connected' : ''}`}>
          <img src="../assets/gitlab.png" alt="GitLab Logo" className="logo" />
          <div className="info">
            <h2>GitLab</h2>
            <p>A web-based platform for version control, issue tracking, and project management.</p>
          </div>
          <button className="connect-btn" onClick={() => handleConnect('gitlab')}>
            {getConnectedState('gitlab') ? 'Disconnect' : 'Connect'}
          </button>
          {gitlabConnected && renderRepoDropdown('gitlab', gitlabRepos, selectedGitlabRepo, handleRepoChange)}
        </div>

        <div className={`integration-card ${bitbucketConnected ? 'connected' : ''}`}>
          <img src="../assets/bitbucket.png" alt="Bitbucket Logo" className="logo" />
          <div className="info">
            <h2>Bitbucket</h2>
            <p>A web-based platform for version control and collaboration, focusing on code review and CI/CD.</p>
          </div>
          <button className="connect-btn" onClick={() => handleConnect('bitbucket')}>
            {getConnectedState('bitbucket') ? 'Disconnect' : 'Connect'}
          </button>
          {bitbucketConnected && renderRepoDropdown('bitbucket', bitbucketRepos, selectedBitbucketRepo, handleRepoChange)}
        </div>

        <div className={`integration-card ${confluenceConnected ? 'connected' : ''}`}>
          <img src="../assets/confluence.png" alt="Confluence Logo" className="logo" />
          <div className="info">
            <h2>Confluence</h2>
            <p>A web-based platform for version control and collaboration.</p>
          </div>
          <button className="connect-btn" onClick={() => handleConnect('confluence')}>
            {getConnectedState('confluence') ? 'Disconnect' : 'Connect'}
          </button>
          {confluenceConnected && (
            <div className="repo-dropdown">
              <select
                value={selectedConfluencePage ? selectedConfluencePage.id : ''}
                onChange={(e) => setSelectedConfluencePage(confluencePages.find(page => page.id === parseInt(e.target.value)))}
              >
                <option value="">Select a page</option>
                {confluencePages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .integration-section {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 30px;
        }

        .integration-card {
          padding: 20px;
          background: #f0f0f0;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-width: 250px;
          max-width: 300px;
        }

        .integration-card.connected {
          border: 2px solid #007bff;
        }

        .integration-card img {
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
        }

        .connect-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }

        .connect-btn:hover {
          background-color: #0056b3;
        }

        .repo-dropdown select {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 16px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Integration;
