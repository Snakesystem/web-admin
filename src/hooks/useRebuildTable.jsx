import 'bootstrap-table';
import 'bootstrap-table/dist/bootstrap-table.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-table/dist/extensions/auto-refresh/bootstrap-table-auto-refresh.js';
import 'bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control.js';
import 'bootstrap-table/dist/extensions/export/bootstrap-table-export.js';
import 'bootstrap-table/dist/extensions/toolbar/bootstrap-table-toolbar.js';
import { Fragment, useContext, useEffect} from 'react';
import { createContext } from 'react'
import $ from 'jquery';
import ModalDetail, { ModalBulkData } from '../components/layout/ModalDetail';
import { useModal } from './useModal';
import moment from 'moment';
import { useResponseHandler } from './useResponseHandler';
import ModalFilter from '../components/layout/ModalFilter';
import { axiosInstance } from './useApi';
import { formatCurrency } from '../utils/utility';
import { resenData } from '../app/admin/deposit';
import { resendInstruksi } from '../app/admin/instruksi';

const RebuildTableContext = createContext();

export const useRebuildTable = () => useContext(RebuildTableContext);

const RebuildTableProvider = ({ children }) => {

    const { openModal } = useModal();
    const destroyTable = () => {
        $('#table').bootstrapTable('destroy');
    }

    const modalDetail = (row, columns) => {
        openModal('detail', <ModalDetail columns={row} headers={columns} />);
    }

    const modalBulkDetail = (row, columns) => {
        openModal('detail', <ModalBulkData columns={row} headers={columns} />);
    }

    const tableFormatter = (columns) => {
        return columns?.map((column) => {
            const colname = column.field?.toLowerCase();
            switch (colname) {
                case 'statement_id':
                case 'autonid':
                    return { ...column, formatter: actionFormatter, events: "cobaClick" }
                case 'statusbo':
                    return { ...column, formatter: statusBOFormatter }
                case 'transactioncode':
                    return { ...column, formatter: transactionCodeFormatter }
                case 'statuscode':
                    return { ...column, formatter: statusCodeFormatter }
                case 'transactiondate':
                    return { ...column, formatter: dateFormatter }
                case 'receivetime':
                case 'sendtime':
                    return { ...column, formatter: dateTimeFormatter }
                case 'amount':
                case 'openbalance':
                case 'closebalance':
                    return { ...column, formatter: currencyFormatter };
                default:
                    return { ...column, formatter: defaultFormatter };
            }
        })
    }

    window.cobaClick = {
        'click #resend': function (value, row, bankid) {
            resenData(value, row, bankid);
        },'click #resend-instruksi': function (value, row, bankid) { 
            resendInstruksi(value, row, bankid);
        }
    }

    const statusBOFormatter = (value) => {

        if (value === 'SUCCESS') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-success">${value}</div>
                </div>`
            )
        } else if(value === 'S21BO') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-primary">${value}</div>
                </div>`
            )
        } else if (value === 'SKIPPED') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-danger">${value}</div>
                </div>`
            )
        } else {
            return `<div>${value}</div> `
        }
    }

    const transactionCodeFormatter = (value) => {
        if (value === 'DEBIT') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-info">${value}</div>
                </div>`
            )
        } else if(value === 'CREDIT') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-warning">${value}</div>
                </div>`
            )
        } else {
            return `<div>${value}</div> `
        }
    }

    const statusCodeFormatter = (value) => {
        if (value === 'SUCCESS') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-success">${value}</div>
                </div>`
            )
        } else if(value === 'REJECTED') {
            return (
                `<div class="text-center">
                    <div class="badge fs-6 text-bg-danger">${value}</div>
                </div>`
            )
        } else {
            return `<div>${value}</div> `
        }
    }

    const dateFormatter = (value) => {
        if (value) {
            return `<div class="text-center">
                ${moment(value).format("DD MMM YYYY")}
            </div>`
        } else {
            return value
        }
    }

    const dateTimeFormatter = (value) => {
        if (value) {
            return `<div class="text-center">
                ${moment(value).format("DD MMM YYYY HH:mm:ss")}
            </div>`
        } else {
            return value
        }
    }

    const currencyFormatter = (value) => {
        if (value) {
            
            if(value < 0) {
                return `<div class="text-end text-danger fw-bold">
                ${formatCurrency(value)}
            </div>`
            } else {
                return `<div class="text-end text-success fw-bold">
                ${formatCurrency(value)}
            </div>`
            }
        } else {
            return value
        }
    }

    const actionFormatter = (value, data) => {

        if(data.StatusBO === "SKIPPED" && data.TransactionCode === "CREDIT") {
            
            return `<div class="d-flex gap-3 flex-row justify-content-between ps-5 pe-5">
            <div class="text-center">${value}</div>
                <i id="resend" class="bi bi-send-fill text-warning cursor-pointer" title="Resend data ${value}"></i>
            </div>`
        } else if(data.StatusCode === "REJECTED") {
            return `<div class="d-flex gap-3 flex-row justify-content-between ps-5 pe-5">
            <div class="text-center">${value}</div>
                <i id="resend-instruksi" class="bi bi-send-fill text-warning cursor-pointer" title="Resend instruksi ${value}"></i>
            </div>`
        }
        return `<div class="text-start ms-5">${value}</div>`
      }

    const defaultFormatter = (value) => {
        if (value) {
            return `<div class="text-center">${value}</div>`
        }

        return `<div class="text-center">-</div>`
    }

    // const loadingTemplate = () => {
    //     return `<div class="loader-container">
    //         <div class="loader"></div>
    //     </div>`
    // }
    
    const buildTable = (url, columns, tablename, filter) => {

        return $('#table').bootstrapTable({
            columns: tableFormatter(columns),
            classes: 'table table-hover table-striped table-bordered',
            url: `${url}/api/monitoring/data?tablename=${tablename}&filter=${Object.keys(filter).length > 0 ? JSON.stringify(filter) : ''}`,
            pagination: true,
            height: 'auto',
            pageSize: 100,
            pageList: [100, 300, 600, 1000],
            pageSizeList: [100, 300, 600, 1000],
            showRefresh: true,
            clickToSelect: true,
            onDblClickRow: function (row) {
                if(tablename === 'bulkbca') {
                    modalBulkDetail(row, columns)
                } else {
                    modalDetail(row, columns)
                }
            },
            sortable: true,
            sidePagination: 'server',
            autoRefresh: true,
            autoRefreshInterval: 60,
            fixedScroll: true,
            toolbar: ".toolbar",
            showColumns: true,
            showToggle: true,
        })
    }

    return (
        <RebuildTableContext.Provider value={{buildTable, destroyTable }}>
            {children}
        </RebuildTableContext.Provider>
    );
};

export default RebuildTableProvider

export function BootstrapTable({ columns, tablename, filter, setFilter }) {

    const { isLoading } = useResponseHandler();
    const { openModal } = useModal();
    const entries = Object.entries(filter);
    
  return (
    <Fragment>
        <div className='toolbar mt-0'>
            <div className="d-flex flex-row gap-2 mb-2">
                <div className="flex-column" title={`Filter by ${tablename}`}>
                <button onClick={() => openModal('filter', <ModalFilter 
                    columns={columns} 
                    tablename={tablename} 
                    filter={filter}
                    setFilter={setFilter}/>)} 
                    className="btn btn-primary pe-3 me-2" type="button" id="refresh-btn">
                        <i className="bi bi-search"></i>
                </button>
            </div>
        </div>
            <div className="d-flex flex-row mb-1">
                <span className='text-dark fw-bold me-2'>Filtered By: </span>
                {entries.length > 0 ? <span>{entries.map(([key, value], index) => (
                        <Fragment key={key}>
                            {key}: {value}
                            {index < entries.length - 1 ? ' | ' : ''}
                        </Fragment>
                    ))}</span> : <span>No Filter</span>}
            </div>
        </div>
        {
            isLoading ? <h1>Loading...</h1> :
            columns.length > 0 ? 
            <BootstrapTableComponent columns={columns} tablename={tablename} filter={filter} />
            : <div className="alert alert-danger text-center" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i> Data not found!
            </div>
        }
    </Fragment>
  )
}

const BootstrapTableComponent = (props) => {
    const { columns, tablename, filter } = props;
    const { openModal } = useModal();
    const { buildTable } = useRebuildTable();

    useEffect(() => {
        buildTable(axiosInstance.defaults.baseURL, columns, tablename, filter, openModal);
    }, [columns, tablename, filter, openModal, buildTable]);
    
    return <table id="table" className="table"></table>
}