import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, Element } from "react-scroll";
import "./App.css";
import { IoMenuSharp } from "react-icons/io5";

const sections = [
  { id: "section1", title: "محصول 1", icon: "🍎" },
  { id: "section2", title: "محصول 2", icon: "🍊" },
  { id: "section3", title: "محصول 3", icon: "🍇" },
  { id: "section4", title: "محصول 4", icon: "🍎" },
  { id: "section5", title: "محصول 5", icon: "🍊" },
  { id: "section6", title: "محصول 6", icon: "🍇" },
  { id: "section7", title: "محصول 7", icon: "🍎" },
  { id: "section8", title: "محصول 8", icon: "🍊" },
  { id: "section9", title: "محصول 9", icon: "🍇" },
  { id: "section10", title: "محصول 10", icon: "🍎" },
  { id: "section11", title: "محصول 11", icon: "🍊" },
  { id: "section12", title: "محصول 12", icon: "🍇" },
];

function App() {
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const menuRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://api.example.com/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
            const menuElement = menuRef.current;
            const menuItem = document.getElementById(`menu-${sectionId}`);
            const menuRect = menuElement.getBoundingClientRect();
            const itemRect = menuItem.getBoundingClientRect();
            if (
              itemRect.left < menuRect.left ||
              itemRect.right > menuRect.right
            ) {
              const offset = itemRect.left - menuRect.left;
              menuElement.scrollBy({
                left: offset,
                behavior: "smooth",
              });
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    return () => {
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section.id);
        if (sectionElement) {
          observer.unobserve(sectionElement);
        }
      });
    };
  }, []);

  useEffect(() => {
    const menuElement = menuRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
      isDown = true;
      startX = e.pageX - menuElement.offsetLeft;
      scrollLeft = menuElement.scrollLeft;
    };

    const stopDragging = () => {
      isDown = false;
    };

    const drag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - menuElement.offsetLeft;
      const walk = (x - startX) * 2;
      menuElement.scrollLeft = scrollLeft - walk;
    };

    menuElement.addEventListener("mousedown", startDragging);
    menuElement.addEventListener("mouseleave", stopDragging);
    menuElement.addEventListener("mouseup", stopDragging);
    menuElement.addEventListener("mousemove", drag);

    return () => {
      menuElement.removeEventListener("mousedown", startDragging);
      menuElement.removeEventListener("mouseleave", stopDragging);
      menuElement.removeEventListener("mouseup", stopDragging);
      menuElement.removeEventListener("mousemove", drag);
    };
  }, []);

  return (
    <div className="relative">
      <nav className="fixed w-full bg-white shadow flex justify-between p-4">
        <button className="p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <IoMenuSharp />
        </button>
        <ul
          ref={menuRef}
          className="flex overflow-x-auto space-x-4 whitespace-nowrap custom-scrollbar no-select"
        >
          {sections.map((section) => (
            <li
              key={section.id}
              id={`menu-${section.id}`}
              className={`cursor-pointer ${
                activeSection === section.id ? "text-blue-500 active-item" : ""
              }`}
            >
              <Link
                to={section.id}
                smooth={true}
                duration={500}
                spy={true}
                onSetActive={() => setActiveSection(section.id)}
              >
                {section.icon} {section.title}
              </Link>
            </li>
          ))}
        </ul>
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
          <Element
            key={section.id}
            id={section.id}
            name={section.id}
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
          </Element>
        ))}
      </div>
    </div>
  );
}

export default App;
