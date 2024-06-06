import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { getDailyTotalTransactions } from "../../../api/transaction/TransactionApi.jsx";
import { getLanguage, translate } from "../../../language/index.jsx";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const ProfitChart = (props) => {
  const { storeId } = props;
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: translate(getLanguage(), "total"),
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDailyTotalTransactions(storeId);

        if (!data) {
          setError("No data received from API");
          return;
        }

        const labels = data.map((item) => item.date);
        const totalData = data.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: translate(getLanguage(), "total"),
              data: totalData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        setError(
          `Error fetching the daily total transactions: ${error.message}`
        );
      }
    };

    fetchData();
  }, [storeId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: translate(getLanguage(), "dailyTotalTransactions"),
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {translate(getLanguage(), "dailyTotalTransactions")}
        </h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default ProfitChart;
