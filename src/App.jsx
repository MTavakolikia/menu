import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, Element } from "react-scroll";
import "./App.css";
import { IoMenuSharp } from "react-icons/io5";
import { FaRegTimesCircle } from "react-icons/fa";

const sections = [
  { id: "section1", title: "Product 1", icon: "🍎" },
  { id: "section2", title: "Product 2", icon: "🍊" },
  { id: "section3", title: "Product 3", icon: "🍇" },
  { id: "section4", title: "Product 4", icon: "🍎" },
  { id: "section5", title: "5 Product", icon: "🍊" },
  { id: "section6", title: "Product 6", icon: "🍇" },
  { id: "section7", title: "Product 7", icon: "🍎" },
  { id: "section8", title: "Product 8", icon: "🍊" },
  { id: "section9", title: "Product 9", icon: "🍇" },
  { id: "section10", title: "Product 10", icon: "🍎" },
  { id: "section11", title: "11Product", icon: "🍊" },
  { id: "section12", title: "Product 12", icon: "🍇" },
];

function App() {
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const menuRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");

      // setProducts(response.data.splice(0, 4));

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
      { threshold: 0.6 } // Adjust threshold if necessary
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
      {sidebarOpen && (
        <div className="h-full w-full bg-slate-600 opacity-50 fixed z-40">
          <button
            className="absolute z-50 flex justify-center text-slate-200 items-center left-5 top-5 text-3xl  font-bold py-3 px-5 rounded-full"
            onClick={() => setSidebarOpen(false)}
          >
            <FaRegTimesCircle />
          </button>
        </div>
      )}
      <nav className="fixed w-full bg-white shadow flex justify-between pt-2">
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
                activeSection === section.id
                  ? "text-blue-500 animate-text-color-change"
                  : ""
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
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-gray-800 text-white p-4 transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <ul>
          <li className="py-2 border-b border-gray-700 cursor-pointer">Home</li>
          <li className="py-2 border-b border-gray-700 cursor-pointer">
            Products
          </li>
          <li className="py-2 border-b border-gray-700 cursor-pointer">
            About us
          </li>
        </ul>
      </div>
      <div className="pt-4 section-parents h-full">
        {sections.map((section) => (
          <Element
            key={section.id}
            id={section.id}
            name={section.id}
            className="max-h-full p-8"
          >
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="mb-2">
                  <div className="shadow-xl rounded-md p-4 bg-white">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-32 object-contain rounded"
                    />
                  </div>

                  <h3 className="mt-2 text-sm lg:text-lg truncate">
                    {product.title}
                  </h3>
                  <h5 className="mt-2 text-sm lg:text-lg">
                    AED {product.price}
                  </h5>
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
