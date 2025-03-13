import React, { useState, useEffect } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdateIcon from '@mui/icons-material/Update';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Avatar from '@mui/material/Avatar';
import slide3 from './slide3.png';
import slide2 from './slide2.jpg';
import slide1 from './slide (1).png';

const LandingPage = () => {
    /*const [stats, setStats] = useState({
        users: 1500,
        groups: 100,
        recipes: 200,
        reviews: 150
      });
    
      const [countedUsers, setCountedUsers] = useState(0);
      const [countedGroups, setCountedGroups] = useState(0);
      const [countedRecipes, setCountedRecipes] = useState(0);
      const [countedReviews, setCountedReviews] = useState(0);
    
      useEffect(() => {
        // Animate the numbers
        let users = 0;
        let groups = 0;
        let recipes = 0;
        let reviews = 0;
    
        const interval = setInterval(() => {
          if (users < stats.users) users += 5;
          if (groups < stats.groups) groups += 1;
          if (recipes < stats.recipes) recipes += 3;
          if (reviews < stats.reviews) reviews += 2;
    
          setCountedUsers(users);
          setCountedGroups(groups);
          setCountedRecipes(recipes);
          setCountedReviews(reviews);
    
          if (users === stats.users && groups == stats.groups && recipes === stats.recipes && reviews === stats.reviews) {
            clearInterval(interval);
          }
        }, 20); // Adjust the interval speed for smooth animation
    
        return () => clearInterval(interval); // Cleanup on component unmount
      }, [stats]);*/

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(90deg, #4b6cb7, #182848)" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Heritage Kitchen</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./Signup">Login/SignUp</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./Feedback">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Carousel */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
        <div className="carousel-item active">
            <img src={require('./slide (1).png')} className="d-block w-100" alt="Feature 1" style={{ width: "800px", height: "500px", objectFit: "cover" }} />
            <div 
            className="carousel-caption d-flex flex-column align-items-start justify-content-center" 
            style={{ background: "rgba(0, 0, 0, 0.5)", padding: "10px", borderRadius: "10px", left: "10%" }}
            >
            <h5 style={{ fontSize: "2rem" }}>Unlock a World of Traditional Flavors</h5>
            <p style={{ fontSize: "1.2rem" }}>Start your journey into the heart of culinary heritage.</p>
            <button className="btn btn-primary mt-3 mb-3" style={{ fontSize: "1.2rem" }}>
                <a href="/Signup" style={{ color: "white", textDecoration: "none" }}>
                Sign-up today
                </a>
            </button>
            </div>
        </div>
        <div className="carousel-item">
            <img src={require('./slide2.jpg')} className="d-block w-100" alt="Feature 2" style={{ width: "800px", height: "500px", objectFit: "cover" }} />
            <div 
            className="carousel-caption d-flex flex-column align-items-center justify-content-center" 
            style={{ background: "rgba(0, 0, 0, 0.5)", padding: "10px", borderRadius: "10px" }}
            >
            <h5 style={{ fontSize: "2rem" }}>Learn the Stories Behind the Recipes</h5>
            <p style={{ fontSize: "1.2rem" }}>Explore the origins of your favorite heritage dishes</p>
            <button className="btn btn-primary mt-3 mb-3" style={{ fontSize: "1.2rem" }}>Learn More</button>
            </div>
        </div>
        <div className="carousel-item">
            <img src={require('./slide3.png')} className="d-block w-100" alt="Feature 3" style={{ width: "800px", height: "500px", objectFit: "cover" }} />
            <div 
            className="carousel-caption d-flex flex-column align-items-end justify-content-center" 
            style={{ background: "rgba(0, 0, 0, 0.5)", padding: "10px", borderRadius: "10px", right: "10%" }}
            >
            <h5 style={{ fontSize: "2rem" }}>Your Voice Matters</h5>
            <p style={{ fontSize: "1.2rem" }}>Help us grow by sharing your thoughts and ideas</p>
            <button className="btn btn-primary mt-3 mb-3" style={{ fontSize: "1.2rem" }}>
                <a href="/Feedback" style={{ color: "white", textDecoration: "none" }}>
                Provide Feedback
                </a>
            </button>
            </div>
        </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Features Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Features</h2>
        <div className="row text-center">
          {[{
            title: "Share your Flavor",
            description: "Upload recipes with text, media, and tags for seamless sharing.",
            icon: <CloudUploadIcon style={{ fontSize: 60, color: "#007bff" }} />
          }, {
            title: "Cook Together, Control Privacy",
            description: "Collaborate in real-time, set privacy levels, and track changes with version history.",
            icon: <UpdateIcon style={{ fontSize: 60, color: "#007bff" }} />
          }, {
            title: "Find Your Dish",
            description: "Easily search and filter recipes by ingredients, cuisine, or dietary needs.",
            icon: <ManageSearchIcon style={{ fontSize: 60, color: "#007bff" }} />
          }].map((feature, index) => (
            <div className="col-md-4" key={index}>
              <div className="card feature-card border-0 shadow-lg">
                <div className="card-body">
                  <div className="mb-3" style={{ fontSize: "60px", color: "#007bff" }}>
                    {feature.icon}
                  </div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text mb-4">{feature.description}</p> {/* Added mb-4 for margin-bottom */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     {/* Testimonial Section */}
     <div className="container my-5">
     <h2 className="text-center mb-4">What Our Users Say</h2>
     <div className="row text-center">
       {[
         {
           name: "Sarah Johnson",
           feedback: "Heritage Kitchen has brought back memories of my grandmother's recipes!",
           avatar: "S"
         },
         {
           name: "Mark Wilson",
           feedback: "The collaborative cooking feature is a game-changer for family gatherings.",
           avatar: "M"
         },
         {
           name: "Emily Davis",
           feedback: "I love how easy it is to find recipes that match my dietary needs.",
           avatar: "E"
         }
       ].map((testimonial, index) => (
         <div className="col-md-4" key={index}>
           <div className="card testimonial-card border-0 shadow-lg">
             <div className="card-body">
               <Avatar 
                 style={{ 
                   backgroundColor: "#007bff", 
                   color: "#fff", 
                   width: "80px", 
                   height: "80px", 
                   margin: "0 auto", 
                   fontSize: "2rem" 
                 }}
               >
                 {testimonial.avatar}
               </Avatar>
               <h5 className="card-title mt-3">{testimonial.name}</h5>
               <p className="card-text">"{testimonial.feedback}"</p>
             </div>
           </div>
         </div>
       ))}
     </div>
   </div>

    {/*Stats Section with Hover Effects and Animated Counter
//    <div className="container my-5 text-center">
//         <h2 className="mb-4">Platform Stats</h2>
//         <div className="row">
//           <div className="col-md-4">
//             <div className="stat-card">
//               <PersonIcon style={{ fontSize: 50, color: "#007bff" }} />
//               <h3>{countedUsers}</h3>
//               <p>Users</p>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="stat-card">
//               <GroupIcon style={{ fontSize: 50, color: "#007bff" }} />
//               <h3>{countedGroups}</h3>
//               <p>Family Groups</p>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="stat-card">
//               <FoodBankIcon style={{ fontSize: 50, color: "#007bff" }} />
//               <h3>{countedRecipes}</h3>
//               <p>Recipes</p>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="stat-card">
//               <FeedbackIcon style={{ fontSize: 50, color: "#007bff" }} />
//               <h3>{countedReviews}</h3>
//               <p>Positive Reviews</p>
//             </div>
//           </div>
//         </div>
//       </div>*/}

        {/* Footer Section */}
    <footer className="bg-dark text-white py-4 mt-5">
    <div className="container">
        <div className="row">
        {/* About Us Section */}
        <div className="col-md-4 mb-3">
            <h5>About Heritage Kitchen</h5>
            <p>Heritage Kitchen is your gateway to discovering, sharing, and enjoying traditional recipes from generations. Join us on a journey of flavor and history.</p>
        </div>

        {/* Quick Links Section */}
        <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
            <li><a href="#" className="text-white text-decoration-none">Home</a></li>
            <li><a href="./Signup" className="text-white text-decoration-none">Login/SignUp</a></li>
            <li><a href="./Feedback" className="text-white text-decoration-none">Contact</a></li>
            </ul>
        </div>

        {/* Contact Information Section */}
        <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p><i className="fas fa-envelope"></i> support@heritagekitchen.com</p>
            <p><i className="fas fa-phone"></i> +1 234 567 890</p>
            <div>
            <a href="#" className="text-white me-2"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-white me-2"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white me-2"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-3">
        <p className="mb-0">© 2024 Heritage Kitchen. All Rights Reserved.</p>
        </div>
    </div>
    </footer>

      {/* CSS for Hover Effect */}
      <style jsx>{`
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.2);
        }
        .testimonial-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.2);
        }
        /* Container for stats cards */
        /*.stat-card {
        background-color: #f9f9f9;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
        margin: 15px 0;
        }

        /* Stat card number styling */
        .stat-card h3 {
        font-size: 2rem;
        font-weight: bold;
        transition: color 0.3s ease;
        }

        /* Stat card text styling */
        .stat-card p {
        font-size: 1.2rem;
        color: #777;
        transition: color 0.3s ease;
        }

        /* Hover effect: Add scale and shadow */
        .stat-card:hover {
        transform: translateY(-10px);  /* Lift the card */
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);  /* Shadow effect */
        }

        /* Icon hover effect */
        .stat-card:hover svg {
        transform: scale(1.1);  /* Slightly enlarge icon */
        transition: transform 0.3s ease;
        }

        /* Smooth transition for stat text */
        .stat-card:hover h3 {
        color: #3498db;  /* Change color on hover */
        }

        .stat-card:hover p {
        color: #3498db;  /* Change color on hover */
        }

        /* Responsive layout */
        @media (max-width: 768px) {
        .stat-card {
            margin-bottom: 20px;
        }
        }*/

        footer {
            background-color: #343a40;
            color: white;
        }
        footer a {
            transition: color 0.3s;
        }
        footer a:hover {
            color: #ffc107;
        }
        footer i {
            font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
