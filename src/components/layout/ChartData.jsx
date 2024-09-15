import { Fragment, useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register( CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

export default function DepositChart({ tablename, bank, title, filter }) {

  return (
    <div className="card my-2 shadow-none border mx-1">
        <div className="card-body"> 
            <h5 className="card-title text-center">{title}</h5>
            <div className="row">
                <div className="col-xl-5">
                    <BarChart tablename={`${tablename}${bank}`} filter={filter} column="StatusBO" />
                </div>
                <div className="col-xl-2">
                    <PieChart tablename={`${tablename}${bank}`} filter={filter} column="TransactionCode" />
                </div>
                <div className="col-xl-5">
                    <LineChart tablename={`${tablename}${bank}`} filter={filter} column="TransactionDate" />
                </div>
            </div>
        </div>
    </div>
  )
}

export const InstruksiChart = ({ tablename, bank, title, filter }) => {
    return ( 
        <div className="card my-2 shadow-none border mx-1">
        <div className="card-body">
            <h5 className="card-title text-center">{title}</h5>
            <div className="row">
                <div className="col-xl-5">
                    <BarChart tablename={`${tablename}${bank}`} filter={filter} column="TrxType" />
                </div>
                <div className="col-xl-2">
                    <PieChart tablename={`${tablename}${bank}`} filter={filter} column="ServiceCode" />
                </div>
                <div className="col-xl-5">
                    <LineChart tablename={`${tablename}${bank}`} filter={filter} column="TransactionDate" />
                </div>
            </div>
        </div>
    </div>
    ) 
}

function BarChart({ tablename, filter, column }) {

    const { getRequest } = useApi();
    const [chartData, setChartData] = useState([]);
    const getDataDeposit = async (tablename, filter, column) => {
        try {
            const response = await getRequest(`api/monitoring/bar-chart?tablename=${tablename}&column=${column}&filter=${filter}`)
            setChartData(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataDeposit(tablename, filter, column)
    }, [tablename, filter, column]);

  return chartData.result && (
    <Fragment>
        {
            column === 'StatusBO' ? <Bar options={{
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                title: {
                    display: true,
                    text: `Chart Off ${column}`,
                },
                
                },
            }} data={{
                labels: chartData.rows?.map(item => item.StatusBO),
                datasets: [
                    {
                        data: chartData.rows?.map(item => item.Count),
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)', 
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                    }
                ]
            }}/> : column === 'TrxType' ? <Bar options={{
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                title: {
                    display: true,
                    text: `Chart Off ${column}`,
                },
                
                },
            }} data={{
                labels: chartData.rows?.map(item => item.TrxType),
                datasets: [
                    {
                        data: chartData.rows?.map(item => item.Count),
                        backgroundColor: [
                            'rgba(75, 255, 102, 0.2)', 
                            'rgba(122, 99, 132, 0.2)',
                            'rgba(75, 175, 225, 0.2)'
                        ],
                    }
                ]
            }}/> :
            <div className="alert alert-danger text-center" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i> Data and Column not found!
            </div>
        }
    </Fragment>
  )
}

function PieChart({ tablename, filter, column }) {
    const { getRequest } = useApi();
    const [chartData, setChartData] = useState([]);
    const getDataDeposit = async (tablename, filter, column) => {
        try {
            const response = await getRequest(`api/monitoring/bar-chart?tablename=${tablename}&column=${column}&filter=${filter}`)
            setChartData(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataDeposit(tablename, filter, column)
    }, [tablename, filter, column]);

    return chartData.result && (
        <Fragment>
            {
                column === 'TransactionCode' ? <Pie options={{
                    responsive: true,
                    plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                    title: {
                        display: true,
                        text: `Chart Off ${column}`,
                    },
                    
                    },
                }} data={{
                    labels: chartData.rows?.map(item => item.TransactionCode),
                    datasets: [
                        {
                            data: chartData.rows?.map(item => item.Count),
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)', 
                                'rgba(255, 99, 132, 0.2)',
                            ],
                        }
                    ]
                }}/> : column === 'ServiceCode' ? <Pie options={{
                        responsive: true,
                        plugins: {
                        legend: {
                            position: 'top',
                            display: false
                        },
                        title: {
                            display: true,
                            text: `Chart Off ${column}`,
                        },
                        
                        },
                    }} data={{
                        labels: chartData.rows?.map(item => item.ServiceCode),
                        datasets: [
                            {
                                data: chartData.rows?.map(item => item.Count),
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.2)', 
                                    'rgba(153, 102, 255, 0.2)'
                                ],
                            }
                        ]
                    }}/>
                 : <div className="alert alert-danger text-center" role="alert">
                    <i className="bi bi-exclamation-circle-fill"></i> Data and Column not found!
                </div>
            }
                
        </Fragment>
    )
}

function LineChart({ tablename, filter, column }) {
    const { getRequest } = useApi();
    const [chartData, setChartData] = useState([]);
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const getDataDeposit = async (tablename, filter, column) => {
        try {
            const response = await getRequest(`api/monitoring/line-chart?tablename=${tablename}&column=${column}&filter=${filter}`)
            setChartData(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataDeposit(tablename, filter, column)
    }, [tablename, filter, column]);

    return chartData.result && (
        <Fragment>
            {   column === 'TransactionDate' ? <Line options={{
                    responsive: true,
                    plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                    title: {
                        display: true,
                        text: `Chart Off ${column}`,
                    },
                    
                    },
                }} data={{
                    labels: monthNames,
                    datasets: [
                        {
                            data: new Array(12).fill(0).map((_, i) => {
                                const monthData = chartData.rows?.find(item => item.MonthTrx - 1 === i);
                                return monthData ? monthData.Count : 0;
                                }),
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)', 
                            ],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            transitions: 0.1
                        }
                    ]
                }}/> 
                : <div className="alert alert-danger text-center" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i> Data and Column not found!
            </div>
            }
        </Fragment>
    )
}