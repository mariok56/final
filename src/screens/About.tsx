import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export const About = () => {
  const navigate = useNavigate();
  
  const teamMembers = [
    {
      name: "Michael Thompson",
      role: "Founder & Master Stylist",
      bio: "With over 15 years of experience, Michael founded Choppers with a vision to blend classic barbering with modern hair styling techniques.",
      image: "./owner.png"
    },
    {
      name: "Sarah Johnson",
      role: "Senior Colorist",
      bio: "Sarah specializes in creative color techniques and has won multiple awards for her innovative approaches to hair coloring.",
      image: "./colorist.png"
    },
    {
      name: "David Wilson",
      role: "Styling Expert",
      bio: "David's celebrity clientele and fashion week experience brings high-end styling techniques to every client's experience.",
      image: "./styling.png"
    },
    {
      name: "Emma Rodriguez",
      role: "Treatment Specialist",
      bio: "Emma's specialized knowledge in hair treatments helps clients achieve healthier, more vibrant hair with customized approaches.",
      image: "./last.png"
    }
  ];

  // Handle button clicks
  const handleBookAppointmentClick = () => {
    navigate("/booking");
  };

  const handleContactUsClick = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-[url(/about-hero.jpg)] bg-cover bg-center h-80">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Choppers</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Where expertise meets style in a premium salon experience
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#fbb034]">Our Story</h2>
            <p className="text-gray-300 mb-4">
              Founded in 2010, Choppers began with a simple mission: to provide exceptional haircare in an environment where everyone feels welcome and valued.
            </p>
            <p className="text-gray-300 mb-4">
              What started as a small salon with just two chairs has grown into a premier destination for those seeking quality cuts, coloring, and styling. Our growth has been fueled by our commitment to continuous learning and adapting to the latest techniques and trends.
            </p>
            <p className="text-gray-300">
              Today, Choppers employs a team of passionate stylists who share our founding vision of creating personalized experiences that help clients look and feel their best.
            </p>
          </div>
          <div className="bg-gray-800 p-1">
            <div className="aspect-square bg-gray-700 overflow-hidden">
              <img src="./about.png" alt="Choppers Salon" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#fbb034]">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 border-t-4 border-[#fbb034]">
              <h3 className="text-xl font-bold mb-4">Expertise</h3>
              <p className="text-gray-300">
                Our stylists undergo continuous training to stay at the forefront of hair care techniques and trends.
              </p>
            </div>
            <div className="bg-gray-900 p-8 border-t-4 border-[#fbb034]">
              <h3 className="text-xl font-bold mb-4">Personalization</h3>
              <p className="text-gray-300">
                We believe every client is unique, deserving a tailored approach to achieve their ideal look.
              </p>
            </div>
            <div className="bg-gray-900 p-8 border-t-4 border-[#fbb034]">
              <h3 className="text-xl font-bold mb-4">Quality</h3>
              <p className="text-gray-300">
                From our techniques to our products, we never compromise on delivering the highest quality experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#fbb034]">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-gray-800 group">
              <div className="aspect-square bg-gray-700 overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-[#fbb034] mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#fbb034]/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience the Choppers Difference</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of satisfied clients and discover why Choppers has become the preferred salon for those who value quality, expertise, and personalized service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold px-8 py-4 rounded-none"
              onClick={handleBookAppointmentClick}
            >
              Book an Appointment
            </Button>
            <Button 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-4 rounded-none"
              onClick={handleContactUsClick}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};