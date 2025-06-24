import React from 'react';
import styled from 'styled-components';
import { Github, Linkedin, Twitter, Mail, Instagram } from 'lucide-react';

const Card = ({ member, layout = 'grid' }) => {
  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'github': return Github
      case 'linkedin': return Linkedin
      case 'twitter': return Twitter
      case 'email': return Mail
      case 'Instagram': return Instagram
      default: return Mail
    }
  }

  if (layout === 'list') {
    return (
      <StyledListWrapper>
        <div className="list-card">
          <div className="bg" />
          <div className="blob" />
          <div className="content">
            <div className="member-info">
              <img
                src={member.image}
                alt={member.name}
                className="member-image"
              />
              <div className="member-details">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-department">{member.department}</p>
              </div>
            </div>

            <div className="member-bio">{member.bio}</div>

            <div className="bottom-section">
              <div className="skills">
                {member.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="social-links">
                {Object.entries(member.social).map(([platform, url]) => {
                  const IconComponent = getSocialIcon(platform)
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <IconComponent size={16} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </StyledListWrapper>
    );
  }

  return (
    <StyledWrapper>
      <div className="card">
        <div className="bg" />
        <div className="blob" />
        <div className="content">
          <img
            src={member.image}
            alt={member.name}
            className="member-image"
          />
          <h3 className="member-name">{member.name}</h3>
          <p className="member-role">{member.role}</p>
          <p className="member-department">{member.department}</p>
          <p className="member-bio ">{member.bio}</p>

          {/* Skills */}
          <div className="skills">
            {member.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>

          {/* Social Links */}
          <div className="social-links">
            {Object.entries(member.social).map(([platform, url]) => {
              const IconComponent = getSocialIcon(platform)
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <IconComponent size={16} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 300px;
    height: 450px;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
    margin: 1rem;
  }

  .bg {
    position: absolute;
    width: calc(100% - 5px);
    height: calc(100% - 5px);
    z-index: 2;
    background: rgba(255, 255, 255, .95);
    backdrop-filter: blur(24px);
    border-radius: 10px;
    overflow: hidden;
    outline: 2px solid white;
  }

  .blob {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #ff0000;
    opacity: 1;
    filter: blur(12px);
    animation: blob-bounce 5s infinite ease;
  }

  .content {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 1rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .member-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 3px solid #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .member-name {
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .member-role {
    font-size: 1rem;
    font-weight: 600;
    color: #007bff;
    margin-bottom: 0.25rem;
  }

  .member-department {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .member-bio {
    font-size: 0.875rem;
    color: #555;
    margin-bottom: 1rem;
    line-height: 1.2;
    max-height: 3.6em; /* 3 lines * 1.2em line-height */
    overflow: hidden;
    position: relative;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }


  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .skill-tag {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }

  .social-links {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .social-link {
    width: 32px;
    height: 32px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      background: #007bff;
      color: white;
      transform: translateY(-2px);
    }
  }

  @keyframes blob-bounce {
    0% {
      transform: translate(-100%, -100%) translate3d(0, 0, 0);
    }

    25% {
      transform: translate(-100%, -100%) translate3d(100%, 0, 0);
    }

    50% {
      transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
    }

    75% {
      transform: translate(-100%, -100%) translate3d(0, 100%, 0);
    }

    100% {
      transform: translate(-100%, -100%) translate3d(0, 0, 0);
    }
  }`;

const StyledListWrapper = styled.div`
  .list-card {
    position: relative;
    width: 100%;
    min-height: 200px;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
    margin: 1rem 0;
  }

  .bg {
    position: absolute;
    // top: 5px;
    // left: 5px;
    width: calc(100% - 5px);
    height: calc(100% - 5px);
    z-index: 2;
    background: rgba(255, 255, 255, .95);
    backdrop-filter: blur(24px);
    border-radius: 10px;
    overflow: hidden;
    outline: 2px solid white;
  }

  .blob {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #ff0000;
    opacity: 1;
    filter: blur(12px);
    animation: blob-bounce 5s infinite ease;
  }

  .content {
    position: relative;
    z-index: 3;
    padding: 1.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .member-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .member-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    flex-shrink: 0;
  }

  .member-details {
    flex-grow: 1;
  }

  .member-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.25rem;
  }

  .member-role {
    font-size: 1.125rem;
    font-weight: 600;
    color: #007bff;
    margin-bottom: 0.25rem;
  }

  .member-department {
    font-size: 1rem;
    color: #666;
  }

  .member-bio {
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex-grow: 1;
  }

  .skill-tag {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .social-links {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .social-link {
    width: 40px;
    height: 40px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      background: #007bff;
      color: white;
      transform: translateY(-2px);
    }
  }

  @keyframes blob-bounce {
    0% {
      transform: translate(-100%, -100%) translate3d(0, 0, 0);
    }

    25% {
      transform: translate(-100%, -100%) translate3d(100%, 0, 0);
    }

    50% {
      transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
    }

    75% {
      transform: translate(-100%, -100%) translate3d(0, 100%, 0);
    }

    100% {
      transform: translate(-100%, -100%) translate3d(0, 0, 0);
    }
  }

  @media (max-width: 768px) {
    .member-info {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .bottom-section {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .skills {
      justify-content: center;
    }
  }
`;

export default Card;
