import React from "react";

const About = () => {
  const timeline = [
    { year: "2010", text: "Company founded with 5 expert technicians" },
    { year: "2015", text: "Expanded services to cover entire metropolitan area" },
    { year: "2018", text: "Achieved 10,000 successful service calls" },
    { year: "2024", text: "Launched digital booking platform" },
  ];
  return (
    <main className="pt-20 font-[Poppins]">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742356808/8db36e8c-57e5-4a94-9959-459879e9d964_1_vhgj4r.jpg" 
            className="w-full h-full object-cover"
            alt="Hero Image"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Quality Home Services You Can Trust
            </h1>
            <p className="text-xl text-white-200 mb-8">
              Your trusted partner in home maintenance and repairs since 2010.
              Professional, reliable, and fully insured services.
            </p>
            <button className="rounded-lg bg-[#000000] text-white px-8 py-4 text-lg font-medium hover:bg-[#1e3a8a] transition">
              Schedule Service Now
            </button>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-4">
              We are a team of dedicated professionals committed to providing
              top-quality handyman services to homeowners and businesses. With
              over a decade of experience, we've built a reputation for
              reliability, expertise, and customer satisfaction.
            </p>
            <p className="text-gray-600">
              Our certified technicians are carefully selected and thoroughly
              trained to handle a wide range of repair and maintenance tasks,
              ensuring that every job is completed to the highest standards.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-xl">1000+</h4>
                <p className="text-gray-600">Projects Completed</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-xl">98%</h4>
                <p className="text-gray-600">Client Satisfaction</p>
              </div>
            </div>
          </div>
          <div>
            {/* Leave space for image */}
            <img
              src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742356808/a921898d-3c48-4b65-986a-832326dd1098_1_qrgrdg.jpg"
              className="rounded-lg shadow-lg"
              alt="Our Team"
            />
          </div>
        </div>
      </section>

     {/* What We Offer */}
<section className="py-12 bg-white">
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
        <div key={index} className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
          {/* Display Image */}
          <div className="mb-4 flex justify-center">
            <img src={service.image} alt={service.title} className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-gray-600">{service.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* About  */}
      <section className="py-6 bg-gray-50 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">About Fixify</h2>
          <p className="text-gray-600 mb-12">
            Founded in 2010, Servat has been committed to providing exceptional home services with integrity and professionalism.
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
    <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
      {/* Display Image */}
      <div className="mb-4 flex justify-center">
        <img src={about.image} alt={about.title} className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{about.title}</h3>
      <p className="text-gray-600">{about.text}</p>
    </div>
  ))}
</div>

        </div>
      </section>
     <section className="py-12 bg-white text-center">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-bold mb-8">Our Journey</h2>

    <div className="relative w-full flex flex-col items-center">
      {/* Vertical Line */}
      <div className="absolute w-[2px] h-full bg-gray-300 left-1/2 transform -translate-x-1/2"></div>

      {/* Pair 1: 2010 and 2015 */}
      <div className="grid grid-cols-2 items-center w-full max-w-4xl mb-1">
        <div className="p-2 text-center">
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm inline-block w-56">
            <h4 className="font-bold text-lg">2010</h4>
            <p className="text-sm text-gray-600">Company founded with 5 expert technicians</p>
          </div>
        </div>
        <div className="p-2 text-center">
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm inline-block w-56">
            <h4 className="font-bold text-lg">2015</h4>
            <p className="text-sm text-gray-600">Expanded services to cover entire metropolitan area</p>
          </div>
        </div>
        <div className="flex justify-center col-span-2 mb-5">
          <div className="w-3 h-3 bg-black rounded-full"></div> {/* Adjusted dot size to match image */}
        </div>
      </div>

      {/* Pair 2: 2018 and 2024 */}
      <div className="grid grid-cols-2 items-center w-full max-w-4xl mb-1">
        <div className="p-2 text-center">
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm inline-block w-56">
            <h4 className="font-bold text-lg">2018</h4>
            <p className="text-sm text-gray-600">Achieved 10,000 successful service calls</p>
          </div>
        </div>
        <div className="p-2 text-center">
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm inline-block w-56">
            <h4 className="font-bold text-lg">2024</h4>
            <p className="text-sm text-gray-600">Launched digital booking platform</p>
          </div>
        </div>
        <div className="flex justify-center col-span-2 mb-12">
          <div className="w-3 h-3 bg-black rounded-full"></div> {/* Adjusted dot size to match image */}
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
  );
};

export default About;
