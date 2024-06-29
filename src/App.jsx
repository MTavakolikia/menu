// App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const sections = [
  { id: "section1", title: "محصول 1", icon: "🍎" },
  { id: "section2", title: "محصول 2", icon: "🍊" },
  { id: "section3", title: "محصول 3", icon: "🍇" },
  // بخش‌های دیگر
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
      <nav className="fixed w-full bg-white shadow flex justify-between p-4">
        <ul className="flex space-x-4">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`cursor-pointer ${
                activeSection === section.id ? "text-blue-500" : ""
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              <span>{section.icon}</span> {section.title}
            </li>
          ))}
        </ul>
        <button className="p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span>🔍</span>
        </button>
      </nav>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
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
          {/* آیتم‌های دیگر */}
        </ul>
      </div>
      <div className="pt-16">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            ref={sectionRefs.current[section.id]}
            className="h-screen p-8"
          >
            <h2 className="text-2xl">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <h3 className="mt-2 text-lg">{product.name}</h3>
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
