import { useEffect, useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { axiosInstance } from "../../hooks/useApi";

const InputTypehead = (props) => {

    const { tablename, columnname, columnkey, minLength, onChange, value } = props;
    
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [column, setColumn] = useState([]);
    const [selected, setSelected] = useState([]);
 
    const getOptionsSearch = async (query) => {
      setIsLoading(true);

      await fetch(`${axiosInstance.defaults.baseURL}/api/monitoring/options?tablename=${tablename}&columnname=${columnname}&columnkey=${columnkey}&querykey=${query}`)
      .then((resp) => resp.json())
      .then((result) => {
        const resultList = result.map(obj => Object.values(obj).toString());
        setOptions(resultList);
        setColumn(result?.map(obj => Object.keys(obj))[0]?.toString())
        setIsLoading(false);
      });
    };

    const onSelectedOption = (event) => {
      onChange(event.join(''), column)
      setSelected(event)
    };

    useEffect(() => {
      if(value === '' || value === null) {
        setSelected([])
      }
    }, [value]);

    const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey={`${column}`}
      defaultInputValue={selected.length > 0 ? selected[1] : value}
      selected={selected}
      minLength={minLength}
      onChange={onSelectedOption}
      onSearch={getOptionsSearch}
      options={options}
      placeholder={`Input to search ${columnname}`}
    />
  );
};

export default InputTypehead;
