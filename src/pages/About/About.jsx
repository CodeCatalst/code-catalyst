import { CheckCircle, Target, Eye, Heart, Award, Users, Calendar } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Purpose',
      description: 'To create a thriving community where students can explore, learn, and excel in technology while building lasting connections and practical skills for their future careers.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading student tech society that bridges the gap between academic learning and industry demands, fostering innovation and technical excellence.'
    },
    {
      icon: Heart,
      title: 'Our Mission',
      description: 'Empowering students through hands-on workshops, collaborative projects, industry mentorship, and a supportive community that encourages continuous learning and growth.'
    }
  ]

  const timeline = [
    {
      year: '2019',
      title: 'Foundation',
      description: 'Code Catalyst was founded by a group of passionate computer science students with a vision to create a collaborative tech community.'
    },
    {
      year: '2020',
      title: 'First Workshop Series',
      description: 'Launched our signature workshop series covering web development, mobile apps, and data science fundamentals.'
    },
    {
      year: '2021',
      title: 'Hackathon Success',
      description: 'Organized our first annual hackathon with 200+ participants and partnerships with leading tech companies.'
    },
    {
      year: '2022',
      title: 'Industry Partnerships',
      description: 'Established partnerships with major tech companies for internships, mentorship programs, and guest speaker series.'
    },
    {
      year: '2023',
      title: 'Community Growth',
      description: 'Reached 1000+ active members and launched our alumni network program for continuous career support.'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Opened our dedicated innovation lab and launched the startup incubation program for student entrepreneurs.'
    }
  ]

  const achievements = [
    {
      icon: Award,
      title: 'Best Student Organization',
      description: 'Winner of University Excellence Award 2023'
    },
    {
      icon: Users,
      title: '1000+ Active Members',
      description: 'Growing community of passionate tech enthusiasts'
    },
    {
      icon: Calendar,
      title: '50+ Events Annually',
      description: 'Workshops, hackathons, and tech talks throughout the year'
    }
  ]

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'President',
      image: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'CS Senior passionate about AI and community building'
    },
    {
      name: 'Alex Chen',
      role: 'Vice President',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Full-stack developer with expertise in React and Node.js'
    },
    {
      name: 'Maya Patel',
      role: 'Technical Lead',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'DevOps enthusiast and open source contributor'
    },
    {
      name: 'Jordan Smith',
      role: 'Community Manager',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Event coordinator with a passion for bringing people together'
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
            About <span className="text-secondary-300">Code Catalyst</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed animate-slide-up">
            We are more than just a tech society - we're a community of innovators, learners, 
            and future leaders who believe in the power of technology to change the world.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to a thriving tech community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-primary"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row-reverse' : ''
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                    <div className="card">
                      <div className="text-primary-600 font-bold text-lg mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Achievements</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <achievement.icon className="text-accent-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Summary Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-gradient">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals driving Code Catalyst forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card text-center hover:scale-105 transition-transform">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/team"
              className="btn-primary inline-flex items-center"
            >
              Meet the Full Team
              <CheckCircle className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About