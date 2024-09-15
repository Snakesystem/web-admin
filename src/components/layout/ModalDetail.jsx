import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi"

export default function ModalDetail({ columns, headers }) {

  return (
    <form className="col-12">
      <div className="row">
        {
          headers?.map((header, index) => (
            <div key={index} className="form-group col-md-4">
                <label>{header.title}</label>
                { header.field === 'StatusMessage' ? (
                  <textarea name="" id="" className="form-control" rows="3" value={columns[header.field] || ''}></textarea>
                ) : <input type="text" className="form-control" 
                onChange={event => columns[header.field] = event.target.value} 
                value={columns[header.field] || ''} id={header.field} 
                placeholder={`Enter ${header.field}`} />}
            </div>
          ))
        }
      </div>
    </form>
  )
}
  
export const ModalBulkData = ({ columns, headers }) => {

  const { getRequest } = useApi();
  const [bulkDetail, setBulkDetail] = useState([]);
  const [replyData, setReplyData] = useState([]);
  const [replyDetail, setReplyDetail] = useState([]);

  // generic/data/getsingle?tablename=instruksibbca&column=Autonid&paramid=3
  const getBulkdDetailData = async (tablename) => {
    try {
        const response = await getRequest(`api/generic/data/getsingle?tablename=ViewBBRIBulkSendDetail&column=headerid&paramid=${columns.headerid}`)
        setBulkDetail(response)
    } catch (error) {
        console.log(error)
    }
  }

  const getReplyData = async (tablename) => {
    try {
        const response = await getRequest(`api/generic/data/getsingle?tablename=ViewBBRIBulkReply&column=headerid&paramid=${columns.headerid}`)
        setBulkDetail(response)
    } catch (error) {
        console.log(error)
    }
  }

  const getReplyDetailData = async (tablename) => {
    try {
        const response = await getRequest(`api/generic/data/getsingle?tablename=ViewBBRIBulkReplyDetail&column=headerid&paramid=${columns.headerid}`)
        setBulkDetail(response)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    // getBulkdDetailData()
    // getReplyData()
    // getReplyDetailData()
  }, []);

  return (
    <form className="col-12">
      <h3>Send File</h3>
      <div className="row border pb-3 mb-3">
        {
          headers?.map((header, index) => (
            <div key={index} className="form-group col-md-4">
                <label>{header.title}</label>
                { header.field === 'StatusMessage' ? (
                  <textarea name="" id="" className="form-control" rows="3" value={columns[header.field] || ''}></textarea>
                ) : <input type="text" className="form-control" 
                onChange={event => columns[header.field] = event.target.value} 
                value={columns[header.field] || ''} id={header.field} 
                placeholder={`Enter ${header.field}`} />}
            </div>
          ))
        }

      <h4 className="mt-3">Send File Detail</h4>
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Row ID</th>
              <th>Transaction Ref No</th>
              <th>Debited Acc</th>
              <th>Amount</th>
              <th>Debited Acc Name</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {
              bulkDetail.length > 0 && bulkDetail?.map((item, index) => (
                <tr key={index}>
                  <td>{item.RowID}</td>
                  <td>{item.TrxRefNo}</td>
                  <td>{item.DebitedAcc}</td>
                  <td>{item.Amount}</td>
                  <td>{item.DebitedAccName}</td>
                  <td>{item.Remark1}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        
      </div>
      <h3>Replay Data</h3>
      <div className="row border">
        {
          replyData.length > 0 && replyData?.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="mb-3">
                <label className="form-label">
                  Bulk Type
                  <input type="text" className="form-control" name={item.BulkType} value={item.BulkType} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Header Id
                  <input type="text" className="form-control" name={item.HeaderID} value={item.HeaderID} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Effective Date
                  <input type="text" className="form-control" name={item.EffectiveDate} value={item.EffectiveDate} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Total Record
                  <input type="text" className="form-control" name={item.TotalRecord} value={item.TotalRecord} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Total Success
                  <input type="text" className="form-control" name={item.TotalSuccess} value={item.TotalSuccess} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Total Failed
                  <input type="text" className="form-control" name={item.TotalFailed} value={item.TotalFailed} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Reason
                  <input type="text" className="form-control" name={item.Reason} value={item.Reason} />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  ReceiveTime
                  <input type="text" className="form-control" name={item.ReceiveTime} value={item.ReceiveTime} />
                </label>
              </div>
            </div>
          ))
        }

        <h4>Replay Detail</h4>
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Row ID</th>
              <th>Transaction Ref No</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {
              replyDetail.length > 0 && bulkDetail?.map((item, index) => (
                <tr key={index}>
                  <td>{item.RowID}</td>
                  <td>{item.TrxRefNo}</td>
                  <td>{item.Status}</td>
                  <td>{item.Reason}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </form>
  )
}