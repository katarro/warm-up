import React, { useEffect } from "react";

import shortid from "shortid";

function App() {
  const [monto, setMonto] = React.useState(""); // Valor prestado
  const [cuota, setCuota] = React.useState(""); //Valor Cuota
  const [ncuotas, setNcuotas] = React.useState(""); // numero de cuotas
  const [creditos, setCreditos] = React.useState([]); // Lista de creditos
  const [nombre, setNombre] = React.useState(""); // Nombre Banco
  const [seguros, setSeguros] = React.useState(""); // Valor seguros opcionales
  const [error, setError] = React.useState(null);
  const [encontrado, setEncontrado] = React.useState(false);

  const agregarTarea = (e) => {
    e.preventDefault();
    //AQUI SE CALCULAN LAS ECUACIONES
    var seguro = Number(seguros);
    var montos = Number(monto);
    var monto_total = seguro + montos;
    var numerador = 0;
    var Ft = ncuotas * cuota;

    //Limite Superior
    var r_sup = Ft / monto_total;
    for (var i = 0; i < ncuotas; i++) {
      numerador += cuota / (i + 1);
    }
    var exp = numerador / Ft;

    //r_sup DECIMAL
    r_sup = (r_sup ** exp - 1).toFixed(4);
    //console.log("r_sup: " + r_sup); //0.68

    let van_total = 0;
    let n = 1;
    let r = Number(r_sup);

    while (encontrado === false) {
      console.log("Primer bucle");
      let van = 0;
      while (n <= ncuotas) {
        console.log("2do bucle");
        console.log("r: " + r);
        van += cuota / (1 + r) ** n; // AQUI NO SE HACE BIEN EL CALCULO
        n++;
      }
      van_total = van - monto_total;

      console.log(van_total);
      if (van_total < 0) {
        r -= 0.01;
      }
      if (van_total > 0) {
        console.log(van_total);
        console.log("R pen-ultimo: " + r);
        break;
      }

      n = 1;
    }
    console.log("R final: " + r);

    var interes_anual = (1 + r) ** 12 - 1;
    interes_anual *= 100;
    r = r * 100;

    //AQUI SE GUARDAN LOS VALORES DE LAS ECUACIONES
    setCreditos([
      ...creditos,
      {
        id: shortid.generate(),
        nombre: nombre, // llave: valor
        interes_anual: interes_anual.toFixed(2),
        interes_mensual: r.toFixed(2),
        total_pagar: ncuotas * cuota
      }
    ]);

    setMonto("");
    setCuota("");
    setNcuotas("");
    setNombre("");
    setSeguros("");

    setError(null);
  };
  useEffect(() => {
    setEncontrado(false);
  }, []);
  const eliminarTarea = (id) => {
    const arrayFiltrado = creditos.filter((item) => item.id !== id);
    setCreditos(arrayFiltrado);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Simulador Costo Financiero</h1>
      <hr />
      <div className="row">
        <div className="col-md-8">
          <h4 className="text-center">Tabla</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Interes Mensual</th>
                <th>Cae</th>
                <th>Total a Pagar</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {creditos.length === 0 ? (
                <tr>
                  <th className="list-group-item"> No hay Datos</th>
                </tr>
              ) : (
                creditos.map((i) => (
                  <tr key={i.id}>
                    <th>{i.nombre}</th>
                    <th>{i.interes_mensual} % </th>
                    <th>{i.interes_anual} %</th>
                    <th>{i.total_pagar}</th>
                    <th>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarTarea(i.id)}
                      >
                        Eliminar
                      </button>
                    </th>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <h4 className="text-center">Agregar Datos</h4>
          <form onSubmit={agregarTarea}>
            {error ? <span className="text-danger">{error}</span> : null}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nombre entidad"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
              required="required"
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Monto"
              onChange={(e) => setMonto(e.target.value)}
              value={monto}
              min="0"
              required="required"
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Numero de cuotas 2-48"
              onChange={(e) => setNcuotas(e.target.value)}
              value={ncuotas}
              min="2"
              max="48"
              required="required"
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Precio cuotas"
              onChange={(e) => setCuota(e.target.value)}
              value={cuota}
              min="0"
              required="required"
            />
            <label>Opcional</label>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Seguros, gastos operaciones..."
              onChange={(e) => setSeguros(e.target.value)}
              value={seguros}
            />

            <button className="btn btn-dark btn-block" type="submit">
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
