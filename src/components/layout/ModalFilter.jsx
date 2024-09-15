import { useState } from "react";
import $ from 'jquery';
import { axiosInstance } from "../../hooks/useApi";
import { useRebuildTable } from "../../hooks/useRebuildTable";
import { DateRangePicker } from "rsuite";
import InputTypehead from "../template/InputTypeheadField";
import { convertDateRangeToISO, formatDateRange } from "../../utils/utility";

export default function ModalFilter({ columns, tablename, setFilter, filter }) {
    
    const [filterValues, setFilterValues] = useState(filter);
    const { buildTable } = useRebuildTable();

    const handleFilterChange = (event, name) => {
        setFilterValues({ ...filterValues, [name]: event });
    };

    const clearFilter = () => {
        setFilterValues({});
    };

    function rebuildTable() {
        $('#table').bootstrapTable('destroy');
        buildTable(axiosInstance.defaults.baseURL, columns, tablename, filterValues);
        setFilter(filterValues);
    }
    
  return (
    <form className="col-12">
        <div className="row">
            { columns?.map((column, index) => (
                <div key={index} className="form-group col-md-6">
                    <label>{column.title}</label>
                    { column.field === 'StatusBO' ? (
                        <select
                            className="form-control"
                            id={column.field}
                            onChange={(event) => handleFilterChange(event.target.value, column.field)}
                            value={filterValues[column.field] || ''}
                        >
                        <option value="">--- Select {column.title} ---</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="SKIPPED">SKIPPED</option>
                        <option value="HOLD">HOLD</option>
                    </select>
                    ) : column.field === 'TrxType' ? (
                        <select
                            className="form-control"
                            id={column.field}
                            onChange={(event) => handleFilterChange(event.target.value, column.field)}
                            value={filterValues[column.field] || ''}
                        >
                        <option value="">--- Select {column.title} ---</option>
                        <option value="COL">COL</option>
                        <option value="CRE">CRE</option>
                        <option value="DCR">DCR</option>
                    </select>
                    ) : column.field === 'ClientID' ? (
                        <InputTypehead 
                            tablename={tablename} 
                            columnname={column.field} 
                            columnkey={column.field} 
                            value={filterValues[column.field] || ''}
                            minLength={2}
                            onChange={handleFilterChange}
                        />
                    ) : column.field === 'TransactionCode' ? (
                        <select
                            className="form-control"
                            id={column.field}
                            onChange={(event) => handleFilterChange(event.target.value, column.field)}
                            value={filterValues[column.field] || ''}
                            >
                            <option value="">--- Select {column.title} ---</option>
                            <option value="DEBIT">DEBIT</option>
                            <option value="CREDIT">CREDIT</option>
                        </select>
                    ) : column.field === 'StatusCode' ? (
                        <select
                            className="form-control"
                            id={column.field}
                            onChange={(event) => handleFilterChange(event.target.value, column.field)}
                            value={filterValues[column.field] || ''}
                            >
                            <option value="">--- Select {column.title} ---</option>
                            <option value="SUCCESS">SUCCESS</option>
                            <option value="REJECTED">REJECTED</option>
                        </select>
                    ): column.field === 'TransactionDate' ? (
                        <input
                            type="date"
                            className="form-control"
                            id={column.field}
                            placeholder={`Enter ${column.field} filter`}
                            onChange={(event) => handleFilterChange(event.target.value, column.field)}
                            value={filterValues[column.field] || ''}
                            />
                    ) : column.field === 'ReceiveTime' ? (
                        <DateRangePicker 
                            size="md"
                            id={column.field}
                            format="yyyy-MM-dd"
                            value={convertDateRangeToISO(filterValues[column.field]) || []}
                            onChange={(event) => handleFilterChange(formatDateRange(event), column.field)}
                            />
                    ) : (
                        <input
                            type="text"
                            className="form-control"
                            id={column.field}
                            placeholder={`Enter ${column.field} filter`}
                            onChange={(event) => handleFilterChange(event.target.value, column.field)}
                            value={filterValues[column.field] || ''}
                        />
                    )}
                </div>
            )) }
        </div>
        <div className="d-flex justify-content-end gap-3">
              <button type="button" className="btn btn-warning" onClick={clearFilter}>
                  <i className="bi bi-arrow-clockwise"></i> Clear
              </button>
              <button type="button" className="btn btn-success" onClick={rebuildTable}>
                  <i className="bi bi-search"></i> Search
              </button>
          </div>
    </form>
  )
}
