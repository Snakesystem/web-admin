import { useEffect, useState } from "react";
import { useMenu } from "../../context/menu";
import { convertDateRangeToISO, formatDateRange, LoadingSkeleton } from "../../utils/utility";
import { DateRangePicker } from "rsuite";
import DepositChart, { InstruksiChart } from "../../components/layout/ChartData";

export default function DashboardPage() {

  const [bankList, setBankList] = useState([]);
  const [filter, setFilter] = useState({});
  const [selectedBank, setSelectedBank] = useState('BBCA');
  const { menu, isLoading } = useMenu();

  const selectBank = (e) => {
    // e.preventDefault();
    setSelectedBank(e.target.value);
  }

  useEffect(() => {
    const allBankIDs = menu?.filter(item => item.BankID) 
      .flatMap(item => item.BankID); 

    const uniqueBankIDs = [...new Set(allBankIDs)];

    setBankList(uniqueBankIDs);
  }, [menu]);

  const handleFilterChange = (data) => {
    setFilter({ReceiveTime: data})
  };

  return (
    <div className="row">
      {
        isLoading ? <LoadingSkeleton count={3} heignt={100}/> :
        <div className="col-md-12">
          <div className="d-flex justify-content-center gap-3 align-items-center justify-content-md-center">
            <div className="form-group">
              <label htmlFor="daterange" className="form-label me-3">Select Month and year: </label>
              <DateRangePicker 
                format="MMMM yyyy" 
                size="sm"
                id="daterange"
                value={Object.keys(filter).length > 0 ? convertDateRangeToISO(JSON.stringify(Object.values(filter)[0])) : []}
                onChange={(event) => handleFilterChange(formatDateRange(event))}
                className="text-center"/>
            </div>
            <label className="form-label">Select Bank : </label>
            {bankList?.map((bank, index) => (
              <div className="mb-2 form-check form-check-inline" key={index}>
                <label className="form-check-label" htmlFor={bank}>
                  {/* {console.log(bank)} */}
                  <input className="form-check-input cursor-pointer" type="radio" 
                    value={bank} 
                    id={bank}
                    name={selectedBank}
                    checked={bank === selectedBank}
                    onChange={selectBank}
                    />
                  <span className="form-label">{bank}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      }
      {/* <DepositChart tablename="deposit" title="Chart Off Deposit Data" bank={selectedBank} filter={JSON.stringify(filter)} /> */}
      <InstruksiChart tablename="instruksi" title="Chart Off Instruksi Data" bank={selectedBank} filter={JSON.stringify(filter)} />
    </div>
  )
}
