import { useState } from "react";
import { z, ZodObject } from "zod";
import { downloadAsCSV, downloadSampleCSV } from "../lib/utils";

type AnyZodObject = ZodObject<any, any, any>;

interface UseFormAndTableProps<C extends AnyZodObject, U extends AnyZodObject> {
  companySchema: C;
  genericSchema: U;
  headerMapping: Record<keyof z.infer<U>, string>;
  sampleDataGenerator: (companyData: Partial<z.infer<C>>) => string[][];
  downloadFileNamePrefix: string;
  contractFieldName: keyof z.infer<C>;
}

export const useFormAndTable = <C extends AnyZodObject, U extends AnyZodObject>({
  companySchema,
  genericSchema,
  headerMapping,
  sampleDataGenerator,
  downloadFileNamePrefix,
  contractFieldName,
}: UseFormAndTableProps<C, U>) => {
  type CompanySchemaType = z.infer<C>;
  type genericSchemaType = z.infer<U>;

  // Estados
  const [companyData, setCompanyData] = useState<Partial<CompanySchemaType>>({});
  const [formData, setFormData] = useState<Partial<genericSchemaType>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [tableData, setTableData] = useState<(genericSchemaType & CompanySchemaType)[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Funções de manipulação de input
  const handleCompanyInputChange = (field: keyof CompanySchemaType, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as string]) {
      setFormErrors(prev => ({ ...prev, [field as string]: undefined }));
    }
  };

  const handleUserInputChange = (field: keyof genericSchemaType, value: string) => {
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
      if (formErrors[key]) newErrors[key] = formErrors[key];
    });
    setFormErrors(newErrors);
  };

  // Funções de ação do formulário
  const handleRegisterOrUpdateClick = () => {
    const companyResult = companySchema.safeParse(companyData);
    const userResult = genericSchema.safeParse(formData);

    if (!companyResult.success || !userResult.success) {
      const newErrors: Record<string, string | undefined> = {};
      if (!companyResult.success) companyResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      if (!userResult.success) userResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      setFormErrors(newErrors);
      return;
    }

    const newEntry = { ...companyResult.data, ...userResult.data };
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

  // Funções de manipulação de arquivo
  const handleDataLoadedFromFile = (data: any[]) => {
    const contractResult = companySchema.safeParse(companyData);
    if (!contractResult.success) {
      const newErrors: Record<string, string | undefined> = {};
      contractResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      setFormErrors(newErrors);
      alert(`Por favor, preencha os dados da empresa antes de fazer o upload do arquivo.`);
      return;
    }
    const validCompanyData = contractResult.data;

    setSuccessMessages([]);
    setErrorMessages([]);
    const newErrorMessages: string[] = [];
    const validRows: (genericSchemaType & CompanySchemaType)[] = [];

    data.forEach((row, index) => {
      const rowData: Partial<genericSchemaType> = {};
      for (const key in headerMapping) {
        rowData[key as keyof genericSchemaType] = row[headerMapping[key as keyof genericSchemaType]];
      }
      const userResult = genericSchema.safeParse(rowData);
      if (userResult.success) {
        validRows.push({ ...validCompanyData, ...userResult.data });
      } else {
        const errorDetails = userResult.error.issues.map(issue => issue.message).join('; ');
        newErrorMessages.push(`Linha ${index + 2}: ${errorDetails}`);
      }
    });

    if (validRows.length > 0) setTableData(prevData => [...prevData, ...validRows]);
    if (newErrorMessages.length > 0) setErrorMessages(newErrorMessages);
    setSuccessMessages(validRows.length > 0 ? [`Total de ${validRows.length} registros válidos foram importados.`] : []);
  };

  const handleDownloadSample = () => {
    const sample = sampleDataGenerator(companyData);
    downloadSampleCSV(sample, `exemplo_${downloadFileNamePrefix}`);
  };

  const handleDownload = () => {
    const contractResult = companySchema.safeParse(companyData);
    if (!contractResult.success) {
      const newErrors: Record<string, string | undefined> = {};
      contractResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      setFormErrors(newErrors);
      alert(`Por favor, preencha os dados da empresa antes de baixar.`);
      return;
    }
    if (tableData.length === 0) {
      alert("Não há dados na tabela para baixar.");
      return;
    }

    const contractValue = contractResult.data[contractFieldName];
    const filename = `${contractValue}_${downloadFileNamePrefix}`;
    const dataToDownload = tableData.map(item => {
      const row: Record<string, any> = {};
      const companyShape = (companySchema as z.ZodObject<any>).shape;
      const userShape = (genericSchema as z.ZodObject<any>).shape;
      Object.keys(companyShape).forEach(key => {
        const header = key.charAt(0).toUpperCase() + key.slice(1); // Simples capitalização
        row[header] = item[key as keyof typeof item];
      });
      Object.keys(userShape).forEach(key => {
        row[headerMapping[key as keyof genericSchemaType]] = item[key as keyof typeof item];
      });
      return row;
    });
    downloadAsCSV(dataToDownload, filename);
  };

  // Retorna todos os estados e funções que a página precisará
  return {
    states: { companyData, formData, formErrors, tableData, editingIndex, successMessages, errorMessages },
    handlers: {
      resetFormAndExitEditing, handleCompanyInputChange, handleUserInputChange, handleRegisterOrUpdateClick,
      handleEditItem, handleRemoveItem, handleDataLoadedFromFile,
      handleDownloadSample, handleDownload, setErrorMessages, setSuccessMessages,
    },
  };
};