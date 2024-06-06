// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTop5MostProfitableProducts } from "../../../api/store/StoreApi";
import { getLanguage, translate } from "../../../language/index.jsx";

const Top5Products = (props) => {
  // eslint-disable-next-line react/prop-types
  const { storeId, top = true } = props;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const lang = getLanguage();
  const currency = translate(lang, 'currency'); // Para birimini çeviriyi burada alın

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTop5MostProfitableProducts(storeId, top);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(
            `${translate(lang, 'errorFetchingCategories')}${error.message}`
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, top]);

  if (loading) {
    return <div className="text-center">{translate(lang, 'loading')}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleViewAllProducts = () => {
    navigate("/product-list");
  };

  const getShadowClass = (profit, index) => {
    if (profit < 0) {
      return "shadow-lg border-l-4 border-red-500";
    }
    const greenShades = [
      "shadow-lg border-l-4 border-green-500",
      "shadow-lg border-l-4 border-green-400",
      "shadow-lg border-l-4 border-green-300",
      "shadow-lg border-l-4 border-green-200",
      "shadow-lg border-l-4 border-green-100",
    ];
    return greenShades[index] || "shadow-lg border-l-4 border-green-100";
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {top
                ? translate(lang, "top5MostProfitableProducts")
                : translate(lang, "bottom5LeastProfitableProducts")}
          </h2>
          <table className="min-w-full bg-white mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-left font-semibold text-gray-600">
                {translate(lang, "productName")}
              </th>
              <th className="py-3 px-5 text-left font-semibold text-gray-600">
                {translate(lang, "profit")}
              </th>
            </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <tr
                    key={index}
                    className={`hover:bg-gray-50 ${getShadowClass(
                        product.profit,
                        index
                    )}`}
                >
                  <td className="py-3 px-5 border-b">{product.name}</td>
                  <td className="py-3 px-5 border-b">
                    {product.profit >= 0
                        ? `${currency}${product.profit.toFixed(2)}`
                        : `-${currency}${Math.abs(product.profit).toFixed(2)}`}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <button
              onClick={handleViewAllProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md"
          >
            {translate(lang, "viewAllProducts")}
          </button>
        </div>
      </div>
  );
};

export default Top5Products;
