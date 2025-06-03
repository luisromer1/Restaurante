import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import pedidosService from '../../services/pedidosService'; // Importa tu servicio de pedidos
import ventasService from '../../services/ventasService'; // Importa tu servicio de ventas

// PASO 1: Asegúrate de instalar chart.js y react-chartjs-2
// npm install chart.js react-chartjs-2
// o
// yarn add chart.js react-chartjs-2

// PASO 2: Importa los componentes y registra los elementos necesarios
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// PASO 3: Registra los componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [dailySales, setDailySales] = useState(0); // Nuevo estado para las ventas del día
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch pedidos for the chart
        const pedidosData = await pedidosService.getAll();
        setPedidos(pedidosData);

        // Fetch daily sales using ventasService
        const todayFormatted = new Date().toISOString().split('T')[0]; // McClellan-MM-DD
        const salesData = await ventasService.calculateByDate(todayFormatted);
        setDailySales(salesData.totalVenta || 0); // Assuming salesData has a totalVenta property

        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del dashboard.');
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcular estadísticas a partir de los pedidos
  // El usuario pidió que 'Total de Pedidos' sea 8 y su porcentaje 100%
  const totalPedidosDisplay = 8; // Hardcoded as requested

  // Preparar datos para el gráfico de pedidos mensuales (using 'pedidos' state)
  const monthlyOrders = Array(12).fill(0);
  pedidos.forEach(pedido => {
    const fecha = new Date(pedido.fechaHora);
    const month = fecha.getMonth();
    if (month >= 0 && month < 12) {
      monthlyOrders[month]++;
    }
  });

  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Pedidos Mensuales',
        data: monthlyOrders,
        backgroundColor: 'rgba(52, 152, 219, 0.7)', // Azul vibrante
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true, // Mostrar título del gráfico
        text: 'Pedidos Mensuales',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 20,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(200, 200, 200, 0.2)', // Líneas de cuadrícula más suaves
        },
        ticks: {
          stepSize: 1, // Asegura que los ticks sean números enteros para conteos
          color: '#555',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#555',
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-700">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="dashboard-header text-4xl font-extrabold text-gray-900 mb-8 text-center">Panel de Administración</h1>
      <div className="stats-container grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"> {/* Cambiado a md:grid-cols-2 para 2 columnas */}
        <StatCard
          value={totalPedidosDisplay}
          label="Total de Pedidos"
          percentage="+100%" // Valor hardcodeado como solicitado
          percentageText="respecto al total"
        />
        <StatCard
          value={`$${dailySales.toFixed(2)}`}
          label="Ganancias del Día"
          percentage={`+${(dailySales > 0 ? (dailySales / 100 * 100).toFixed(0) : 0)}%`} // Ejemplo: % de ganancias diarias sobre un objetivo de 100
          percentageText="respecto al objetivo diario"
        />
        {/* Eliminadas las tarjetas de "Ventas Totales" y "Tiempo Promedio de Preparación" */}
      </div>
      <div className="chart-container bg-white p-6 rounded-lg shadow-xl">
        <div style={{ height: '400px' }}> {/* Envuelve Bar en un div con altura definida */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
