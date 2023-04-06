import tableDataComplex from "./variables/tableDataComplex";
import ComplexTable from "./components/ComplexTable";

const Tables = () => {
  return (
    <div>
      <div className="mt-6 w-full h-full">
        <ComplexTable tableData={tableDataComplex} />
      </div>
    </div>
  );
};

export default Tables;
