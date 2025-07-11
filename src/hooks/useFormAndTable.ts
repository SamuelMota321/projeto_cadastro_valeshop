import { useState } from "react";
import { z, ZodObject } from "zod";
import { downloadAsCSV, downloadSampleCSV } from "../lib/utils";

type AnyZodObject = ZodObject<any, any, any>;

interface UseFormAndTableProps<T extends AnyZodObject, C extends AnyZodObject> {
  dataSchema: T;
  companySchema: C;
  headerMapping: Record<keyof z.infer<T>, string>;
  sampleDataGenerator: (companyData: Partial<z.infer<C>>) => string[][];
  downloadFileName: string;
}

export const useFormAndTable = <T extends AnyZodObject, C extends AnyZodObject>({
  dataSchema,
  companySchema,
  headerMapping,
  sampleDataGenerator,
  downloadFileName,
}: UseFormAndTableProps<T, C>) => {
  type DataSchemaType = z.infer<T>;
  type CompanySchemaType = z.infer<C>;

  const [companyData, setCompanyData] = useState<Partial<CompanySchemaType>>({});
  const [formData, setFormData] = useState<Partial<DataSchemaType>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [tableData, setTableData] = useState<(DataSchemaType & CompanySchemaType)[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);


  const handleCompanyInputChange = (field: keyof CompanySchemaType, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as string]) {
      setFormErrors(prev => ({ ...prev, [field as string]: undefined }));
    }
  };

  const handleDataInputChange = (field: keyof DataSchemaType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as string]) {
      setFormErrors(prev => ({ ...prev, [field as string]: undefined }));
    }
  };

  const resetFormAndExitEditing = () => {
    setFormData({});
    setEditingIndex(null);
    const companyKeys = Object.keys(companySchema.shape);
    const newErrors: Record<string, string | undefined> = {};
    companyKeys.forEach(key => {
      if (formErrors[key]) {
        newErrors[key] = formErrors[key];
      }
    });
    setFormErrors(newErrors);
  };

  const handleRegisterOrUpdateClick = async () => {
    const companyResult = companySchema.safeParse(companyData);
    const dataResult = dataSchema.safeParse(formData);

    if (!companyResult.success || !dataResult.success) {
      const newErrors: Record<string, string | undefined> = {};
      if (!companyResult.success) {
        companyResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      }
      if (!dataResult.success) {
        dataResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      }
      setFormErrors(newErrors);
      return;
    }

    const newEntry = { ...companyResult.data, ...dataResult.data };

    if (editingIndex !== null) {
      const updatedData = [...tableData];
      updatedData[editingIndex] = newEntry;
      setTableData(updatedData);
    } else {

      setTableData(prevData => [...prevData, newEntry]);
    }
    resetFormAndExitEditing();
  };

  const handleEditItem = (indexToEdit: number) => {
    const item = tableData[indexToEdit];
    setCompanyData(item);
    setFormData(item);
    setEditingIndex(indexToEdit);
    setFormErrors({});
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setTableData(prevData => prevData.filter((_, index) => index !== indexToRemove));
  };

  const handleDataLoadedFromFile = (data: any[]) => {
    const contractResult = companySchema.safeParse(companyData);
    if (!contractResult.success) {
      const newErrors: Record<string, string | undefined> = {};
      contractResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      setFormErrors(newErrors);
      alert("Por favor, preencha o N° do contrato antes de fazer o upload do arquivo.");
      return;
    }
    const validCompanyData = contractResult.data;

    setSuccessMessages([]);
    setErrorMessages([]);
    const newErrorMessages: string[] = [];
    const validRows: (DataSchemaType & CompanySchemaType)[] = [];

    data.forEach((row, index) => {
      const rowData: Partial<DataSchemaType> = {};
      for (const key in headerMapping) {
        rowData[key as keyof DataSchemaType] = row[headerMapping[key as keyof DataSchemaType]];
      }

      const dataResult = dataSchema.safeParse(rowData);
      if (dataResult.success) {
        validRows.push({ ...validCompanyData, ...dataResult.data });
      } else {
        const errorDetails = dataResult.error.issues.map(issue => {
          const fieldName = issue.path[0] as keyof typeof headerMapping;
          const friendlyFieldName = headerMapping[fieldName] || fieldName;
          return `Campo "${friendlyFieldName as string}": ${issue.message}`;
        }).join('; ');
        newErrorMessages.push(`Linha ${index + 2}: ${errorDetails}`);
      }
    });

    if (validRows.length > 0) {
      setTableData(prevData => [...prevData, ...validRows]);
      setSuccessMessages([`Total de ${validRows.length} registros válidos foram importados.`]);
    }
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
    }
  };

  const handleDownloadSample = () => {
    const sample = sampleDataGenerator(companyData);
    downloadSampleCSV(sample, `exemplo_${downloadFileName}`);
  };

  const handleDownload = () => {
    const contractResult = companySchema.safeParse(companyData);
    if (!contractResult.success) {
      const newErrors: Record<string, string | undefined> = {};
      contractResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      setFormErrors(newErrors);
      alert("Por favor, preencha o N° do contrato antes de baixar.");
      return;
    }
    if (tableData.length === 0) {
      alert("Não há dados na tabela para baixar.");
      return;
    }

    const filename = `${contractResult.data.numeroContrato}_${downloadFileName}`;
    const dataToDownload = tableData.map(item => {
      const row: Record<string, any> = {};
      const companyShape = (companySchema as z.ZodObject<any>).shape;
      const dataShape = (dataSchema as z.ZodObject<any>).shape;
      Object.keys(companyShape).forEach(key => row[key] = item[key as keyof typeof item]);
      Object.keys(dataShape).forEach(key => row[headerMapping[key as keyof DataSchemaType]] = item[key as keyof typeof item]);
      return row;
    });
    downloadAsCSV(dataToDownload, filename);
  };

  return {
    states: { companyData, formData, formErrors, tableData, editingIndex, successMessages, errorMessages },
    handlers: {
      resetFormAndExitEditing,
      handleCompanyInputChange,
      handleDataInputChange,
      handleRegisterOrUpdateClick,
      handleEditItem,
      handleRemoveItem,
      handleDataLoadedFromFile,
      handleDownloadSample,
      handleDownload,
      setErrorMessages,
      setSuccessMessages,
    },
  };
};