// App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const sections = [
  { id: "section1", title: "محصول 1", icon: "🍎" },
  { id: "section2", title: "محصول 2", icon: "🍊" },
  { id: "section3", title: "محصول 3", icon: "🍇" },
  { id: "section4", title: "محصول 4", icon: "🍎" },
  { id: "section5", title: "5 محصول", icon: "🍊" },
  { id: "section6", title: "محصول 6", icon: "🍇" },
  { id: "section7", title: "محصول 7", icon: "🍎" },
  { id: "section8", title: "محصول 8", icon: "🍊" },
  { id: "section9", title: "9", icon: "🍇" },
  { id: "section10", title: "محصول 10", icon: "🍎" },
  { id: "section11", title: "11محصول", icon: "🍊" },
  { id: "section12", title: "محصول 12", icon: "🍇" },
];

function App() {
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const sectionRefs = useRef(
    sections.reduce((acc, value) => {
      acc[value.id] = React.createRef();
      return acc;
    }, {})
  );

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    for (const section of sections) {
      const sectionRef = sectionRefs.current[section.id].current;
      if (
        sectionRef.offsetTop <= scrollPosition &&
        sectionRef.offsetTop + sectionRef.offsetHeight > scrollPosition
      ) {
        setActiveSection(section.id);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    fetchProducts();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    sectionRefs.current[id].current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {sidebarOpen && (
        <div className="h-full w-full bg-slate-600 opacity-50 fixed z-40">
          <button
            className="absolute z-50 flex  justify-center items-center	 left-5 top-5 bg-white text-3xl text-gray-900 font-bold py-3 px-5 rounded-full "
            onClick={() => setSidebarOpen(false)}
          >
            <i className="">&times;</i>
          </button>
        </div>
      )}
      <nav className="fixed w-full bg-white shadow flex justify-between p-4">
        <button className="p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span>🔍</span>
        </button>
        <ul className="flex overflow-x-auto space-x-4 whitespace-nowrap custom-scrollbar">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`cursor-pointer ${
                activeSection === section.id ? "text-blue-500" : ""
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.icon} {section.title}
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={`fixed top-0 z-50 right-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <ul>
          <li className="py-2 border-b border-gray-700 cursor-pointer">
            آیتم 1
          </li>
          <li className="py-2 border-b border-gray-700 cursor-pointer">
            آیتم 2
          </li>
          <li className="py-2 border-b border-gray-700 cursor-pointer">
            آیتم 3
          </li>
        </ul>
      </div>
      <div className="pt-16">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            ref={sectionRefs.current[section.id]}
            className=" p-8"
          >
            <h2 className="text-2xl">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-52 object-contain rounded"
                  />
                  <h3 className="mt-2 text-lg text-slate-9500">
                    {product.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
