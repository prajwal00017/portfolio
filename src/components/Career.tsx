import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Developer</h4>
                <h5>Fidelity Investments</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Built Spring Boot microservices contributing to 25% of a core backend module. Increased unit test coverage from 27% to 95%, reducing regressions by 40%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer Intern</h4>
                <h5>Slash Mark</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Built 15+ REST APIs and React workflows for a finance platform. Optimized PostgreSQL queries, improving API response times by 30%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Technology in Computer Science and Engineering</h4>
                <h5>Dayananda Sagar University</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              Graduated with a CGPA of 7.41. Developed strong foundational skills in Data Structures, OOP, and Software Engineering practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
