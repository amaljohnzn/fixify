import React from "react";

const About = () => {
  const timeline = [
    { year: "2010", text: "Company founded with 5 expert technicians" },
    { year: "2015", text: "Expanded services to cover entire metropolitan area" },
    { year: "2018", text: "Achieved 10,000 successful service calls" },
    { year: "2024", text: "Launched digital booking platform" },
  ];

  return (
    <main className="pt-18 font-[Poppins]">
      {/* Who We Are */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="mb-4">
              We are a team of dedicated professionals committed to providing top-quality handyman services to homeowners and businesses. With over a decade of experience, we've built a reputation for reliability, expertise, and customer satisfaction.
            </p>
            <p>
              Our certified technicians are carefully selected and thoroughly trained to handle a wide range of repair and maintenance tasks, ensuring that every job is completed to the highest standards.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-xl">1000+</h4>
                <p>Projects Completed</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-xl">98%</h4>
                <p>Client Satisfaction</p>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742356808/a921898d-3c48-4b65-986a-832326dd1098_1_qrgrdg.jpg"
              className="rounded-lg shadow-lg"
              alt="Our Team"
            />
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 bg-">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741584078/leadership-development_18478970_qvfaqy.png",
                title: "Professional Services",
                text: "Comprehensive home repair and maintenance services delivered by certified professionals.",
              },
              {
                image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741584085/24-hours-support_5300750_c9xbdj.png",
                title: "24/7 Availability",
                text: "Round-the-clock emergency services to address your urgent repair needs.",
              },
              {
                image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741584144/guarantee_11293652_guvw9z.png",
                title: "Guaranteed Quality",
                text: "100% satisfaction guarantee on all our work with warranty coverage.",
              },
            ].map((service, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-sm">
                <div className="mb-4 flex justify-center">
                  <img src={service.image} alt={service.title} className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p>{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-6 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">About Fixify</h2>
          <p className="mb-12">
            Founded in 2010, Fixify has been committed to providing exceptional home services with integrity and professionalism.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741583657/medal_1007290_tcdgvp.png",
                title: "Our Mission",
                text: "To deliver reliable, high-quality home services that exceed customer expectations.",
              },
              {
                image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741583687/hired_15755755_zj4qs5.png",
                title: "Our Values",
                text: "Integrity, excellence, and customer satisfaction guide everything we do.",
              },
              {
                image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741583695/contract_5507225_oyo1bk.png",
                title: "Our Promise",
                text: "100% satisfaction guarantee on all our services.",
              },
            ].map((about, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-sm">
                <div className="mb-4 flex justify-center">
                  <img src={about.image} alt={about.title} className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{about.title}</h3>
                <p>{about.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
    </main>
  );
};

export default About;
