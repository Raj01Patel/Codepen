import React from 'react';
import { useSelector } from 'react-redux';
import './Projects.css';
import { useNavigate } from 'react-router-dom';

const Projects = ({ searchText }) => {
    const projects = useSelector((state) => state.projects?.projects);

    const filteredProjects = projects?.filter((project) =>
        project.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="projects-container">
            {filteredProjects && filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
    );
}

const ProjectCard = ({ project, index }) => {
    const user = useSelector((state) => state.user?.user);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/newProject/${project?.id}`);
    };

    if (!project) {
        return null;
    }


    return (
        <div className="project-card" onClick={handleCardClick}>
            <iframe
                title={`Project ${index}`}
                srcDoc={project?.output}
                style={{ height: "100%", width: "100%", border: "none" }}
            />
            <div className="user-profile">
                <div className="user-info3">
                    {project?.user?.photoURL ? (
                        <img src={user?.photoURL} alt="User" className="user-photo" />
                    ) : (
                        <div className="user-initial">{project?.user?.email[0]}</div>
                    )}
                    <div>
                        <p style={{ color: "white", fontSize: "17px", fontWeight: "600", textTransform: "capitalize" }}>{project.title}</p>
                        <p style={{ color: "white", textTransform: "capitalize" }}>
                            {project?.user?.displayName || project?.user?.email?.split('@')[0]}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;
