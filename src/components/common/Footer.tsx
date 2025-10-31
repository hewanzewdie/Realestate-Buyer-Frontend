import logo from "../../assets/logo.png";
export default function Footer() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };
  return (
    <footer className="bg-green-100 flex flex-col md:flex-row justify-around md:items-center space-y-5 p-10 mt-10">
      <img src={logo} alt="logo" className="w-10 h-10 " />
      <div className="flex flex-col space-x-5">
        {["home", "services", "listings"].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(id);
            }}
            className="hover:font-semibold hover:underline"
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>
      <div>
        <p>+251 911 223344</p>
        <p>realestate@gmail.com</p>
        <p>Real st.Addis Ababa, Ethiopia</p>
      </div>
      <p>Find your new home wheather for rent or to buy</p>
    </footer>
  );
}
