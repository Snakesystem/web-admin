import { useLocation, useParams } from "react-router-dom";
// import BootstrapTable from "../../components/template/BootstrapTable";
import { axiosInstance, useApi } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { ModalContentProvider } from "../../hooks/useModal";
import { transformTitle } from "../../utils/utility";
import { BootstrapTable } from "../../hooks/useRebuildTable";
import Swal from "sweetalert2";
import moment from "moment";

export const resenData = (event, value, row) => {

  let bankParam;
  function getLastSegment(str) {
    // Pecah string berdasarkan tanda '/'
    let segments = str.split('/');
    // Ambil elemen terakhir dari array
    return segments[segments.length - 1];
  }

  const param = window.location.pathname;
  if(getLastSegment(param) === 'BBCA') {
    bankParam = 'bca';
  } else if(getLastSegment(param) === 'BBRI') {
    bankParam = 'bri';
  }

  Swal.fire({
    title: "Please enter pasword to resend statement",
    input: "text",
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Resend",
    showLoaderOnConfirm: true,
    preConfirm: async (password) => {

      try {
        const response = await fetch(`${axiosInstance.defaults.baseURL}/api/${bankParam}/inject/statement?Pass=${password}&StatementID=${value}`);
        if (!response.ok) {
          return Swal.showValidationMessage(`
            ${JSON.stringify(await response.json())}
          `);
        }
        return response.json();
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `Client ID ${row.ClientID}`,
        text: `${result.value.ResponseMessage}`,
        icon: "success",
        // text: `${JSON.stringify(result.value)}`,
      });
    }
  });
}

export default function DepositPage() {
  const { pathname } = useLocation();
  const defaultFilter = { TransactionDate: moment().format("YYYY-MM-DD") };
  const { bankid } = useParams();
  const tablename = pathname.split('/').join('').toLowerCase();
  const [dataBank, setDataBank] = useState([]);
  const { getRequest } = useApi();
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState(defaultFilter);

  const getBank = async (bankid) => {
    try {
      const response = await getRequest(`api/monitoring/bank?bankid=${bankid}`)
      setDataBank(response)
    } catch (error) {
      console.log(error)
    }
  }

  const getHeaderColumns = async (tablename) => {
    try {
        const response = await getRequest(`api/monitoring/header?tablename=${tablename}`)
        setColumns(response)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    getBank(bankid)
    getHeaderColumns(tablename)

  }, [bankid, tablename]);

  return (
    <div>
      <h3 className="mt-0 mb-0">{dataBank? dataBank?.BankName : 'No Data Bank'}</h3>
      <BootstrapTable
        columns={columns} 
        setFilter={setFilter}
        filter={filter}
        tablename={tablename}/>
        <ModalContentProvider id="filter" size="md" title={`FILTER ${transformTitle(pathname).toUpperCase()}`}/>
        <ModalContentProvider id="detail" size="lg" title={`DETAIL DATA ${transformTitle(pathname).toUpperCase()}`}/>
    </div>
  )
}
