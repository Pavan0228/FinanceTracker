import React from 'react';
import { Linkedin, Mail, Github, Code, User } from 'lucide-react';

const TeamMember = ({ name, email, linkedin, github }) => (
    <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-lg w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1rem)] transition-all duration-300 hover:scale-105 border border-gray-700">
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-6 border-2 border-orange-500/20">
            <User size={40} className="text-emerald-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-emerald-400 mb-4">{name}</h3>
        
        <div className="w-12 h-1 bg-orange-400 rounded-full mb-6"></div>
        
        <div className="flex space-x-6 mt-4">
            {email && (
                <a 
                    href={`mailto:${email}`} 
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
                    title="Email"
                >
                    <Mail size={22} />
                </a>
            )}
            <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
                title="LinkedIn"
            >
                <Linkedin size={22} />
            </a>
            <a 
                href={github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
                title="GitHub"
            >
                <Github size={22} />
            </a>
        </div>
    </div>
);

const AboutUsPage = () => {
    const teamMembers = [
        {
            name: "Sridhar Pillai",
            email: "sridharpillai75@gmail.com",
            linkedin: "https://www.linkedin.com/in/sridharpillai/",
            github: "https://github.com/Sridhar1030"
        },
        {
            name: "Pavan Rasal",
            email: "pavanrasal4@gmail.com",
            linkedin: "https://www.linkedin.com/in/pavan-rasal-320123326/",
            github: "https://github.com/Pavan-0228"
        },
        {
            name: "Nikhil Sarak",
            email: "alex.chen@university.edu",
            linkedin: "https://www.linkedin.com/in/nikhil-sarak-463a04256/",
            github: "https://github.com/Nikhil4123"
        },
        {
            name: "Vipul Patil",
            email: "vp0389864@gmail.com",
            linkedin: "https://www.linkedin.com/in/vipul-patil-392a4b259/",
            github: "https://github.com/Vipul"
        }
    ];

    return (
        <div className="bg-gray-900 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Code size={32} className="text-emerald-400" />
                    <h1 className="text-4xl font-bold text-emerald-400">Our Team</h1>
                </div>

                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto text-lg">
                    We are a team of computer science students passionate about making personal finance management accessible and automated through technology.
                </p>

                <div className="flex flex-wrap gap-8 justify-center">
                    {teamMembers.map((member, index) => (
                        <TeamMember key={index} {...member} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;