import ListadoEmpleados from "./empleados/ListadoEmpleados";

function App() {
  return (
    <div className="container my-5">
      <header className="pb-3 mb-4 border-bottom text-center text-md-start">
        <h1 className="display-5 fw-bold text-dark">
          Sistema de Gestión de Recursos Humanos
        </h1>
        <p className="fs-5 text-muted mb-0">FullStack React y Django</p>
      </header>

      <main>
        <ListadoEmpleados />
      </main>

      <footer className="pt-3 mt-5 text-muted border-top text-center">
        Desarrollo de Software Profesional &copy; 2026
      </footer>
    </div>
  );
}

export default App;
