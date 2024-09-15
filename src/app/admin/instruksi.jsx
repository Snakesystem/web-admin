import { useLocation, useParams } from "react-router-dom";
import { axiosInstance, useApi } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { ModalContentProvider } from "../../hooks/useModal";
import { transformTitle } from "../../utils/utility";
import moment from "moment";
import { BootstrapTable } from "../../hooks/useRebuildTable";
import Swal from "sweetalert2";

export const resendInstruksi = (event, value, row) => {

  console.log(row.BankInstructionNID);

  Swal.fire({
    icon: 'question',
    title: "Resend bank instruction",
    text: `You will be resend this bank instruction nid ${row.BankInstructionNID} !`,
    showCancelButton: true,
    confirmButtonText: "Resend",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const response = await axiosInstance.get(`/api/monitoring/inject/instruction?BankInstructionNID=${row.BankInstructionNID}`);
        if(response.data.Result) {
          return Swal.fire({
            icon: 'success',
            title: 'Resend Success',
            text: response.data.Message
          })
        } else {
          return Swal.fire({
            icon: 'Info',
            title: 'Resend Failed',
            text: response.data.Message
          })
        }
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
  });
}

export default function InstruksiPage() {
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
