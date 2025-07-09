import { useState } from "react";
import { z, ZodType } from "zod";
import { downloadAsCSV, downloadSampleCSV } from "../lib/utils";

type AnyZodObject = ZodType<any, any, any>;

interface UseFormAndTableProps<T extends AnyZodObject, C extends AnyZodObject> {
  userSchema: T;
  companySchema: C;
  headerMapping: Record<keyof z.infer<T>, string>;
  sampleDataGenerator: (companyData: Partial<z.infer<C>>) => string[][];
  downloadFileName: string;
}

export const useFormAndTable = <T extends AnyZodObject, C extends AnyZodObject>({
  userSchema,
  companySchema,
  headerMapping,
  sampleDataGenerator,
  downloadFileName,
}: UseFormAndTableProps<T, C>) => {
  type UserSchemaType = z.infer<T>;
  type CompanySchemaType = z.infer<C>;

  const [companyData, setCompanyData] = useState<Partial<CompanySchemaType>>({});
  const [formData, setFormData] = useState<Partial<UserSchemaType>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [tableData, setTableData] = useState<(UserSchemaType & CompanySchemaType)[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleCompanyInputChange = (field: keyof CompanySchemaType, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUserInputChange = (field: keyof UserSchemaType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetFormAndExitEditing = () => {
    setFormData({});
    setEditingIndex(null);

    // CORREÇÃO: Remove todos os erros, exceto os relacionados ao 'companySchema'.
    // Isso garante que os erros do formulário do usuário sejam limpos ao cancelar.
    const newErrors: Record<string, string | undefined> = {};
    const companyKeys = Object.keys(companySchema.shape);

    companyKeys.forEach(key => {
      if (formErrors[key]) {
        newErrors[key] = formErrors[key];
      }
    });

    setFormErrors(newErrors);
  };

  const handleRegisterOrUpdateClick = () => {
    const companyResult = companySchema.safeParse(companyData);
    const userResult = userSchema.safeParse(formData);

    if (companyResult.success && userResult.success) {
      setFormErrors({});
      // Agora o TypeScript sabe que .data existe em ambos os resultados
      const newEntry = { ...companyResult.data, ...userResult.data };

      if (editingIndex !== null) {
        const updatedData = [...tableData];
        updatedData[editingIndex] = newEntry;
        setTableData(updatedData);
      } else {
        setTableData(prevData => [...prevData, newEntry]);
      }
      resetFormAndExitEditing();
    } else {
      const newErrors: Record<string, string | undefined> = {};
      if (!companyResult.success) {
        companyResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      }
      if (!userResult.success) {
        userResult.error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
      }
      setFormErrors(newErrors);
    }
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
      alert("Por favor, preencha o N° do contrato da empresa antes de fazer o upload do arquivo.");
      return;
    }
    const validCompanyData = contractResult.data;

    setSuccessMessages([]);
    setErrorMessages([]);
    const newErrorMessages: string[] = [];
    const validRows: (UserSchemaType & CompanySchemaType)[] = [];

    data.forEach((row, index) => {
      const rowData: Partial<UserSchemaType> = {};
      for (const key in headerMapping) {
        rowData[key as keyof UserSchemaType] = row[headerMapping[key as keyof UserSchemaType]];
      }

      const userResult = userSchema.safeParse(rowData);
      if (userResult.success) {
        validRows.push({ ...validCompanyData, ...userResult.data });
      } else {
        const errorDetails = userResult.error.issues.map(issue => issue.message).join('; ');
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
      alert("Por favor, preencha os dados da empresa antes de baixar.");
      return;
    }
    if (tableData.length === 0) {
      alert("Não há dados na tabela para baixar.");
      return;
    }

    const filename = `${contractResult.data.numeroContrato}_${downloadFileName}`;
    const dataToDownload = tableData.map(item => {
      const row: Record<string, any> = {};
      Object.keys(companySchema.shape).forEach(key => row[key] = item[key]);
      Object.keys(userSchema.shape).forEach(key => row[headerMapping[key as keyof UserSchemaType]] = item[key]);
      return row;
    });
    downloadAsCSV(dataToDownload, filename);
  };

  // Retorna todos os estados e funções que a página precisará
  return {
    states: {
      companyData,
      formData,
      formErrors,
      tableData,
      editingIndex,
      successMessages,
      errorMessages,
    },
    handlers: {
      resetFormAndExitEditing,
      setCompanyData,
      setFormData,
      handleCompanyInputChange,
      handleUserInputChange,
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