import * as React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItemContext = React.createContext<{ id: string }>({} as {
  id: string;
});

function FormItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.formItem, style]} {...props}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

function FormLabel({
  children,
  style,
  ...props
}: { children: React.ReactNode; style?: any }) {
  const { error } = useFormField();
  return (
    <Text
      style={[styles.label, error ? styles.labelError : undefined, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

function FormControl({
  children,
  style,
  ...props
}: { children?: React.ReactNode; style?: any } & React.ComponentProps<
  typeof TextInput
>) {
  const { error } = useFormField();
  return (
    <TextInput
      style={[styles.input, error ? styles.inputError : undefined, style]}
      {...props}
    >
      {children}
    </TextInput>
  );
}

function FormDescription({
  children,
  style,
  ...props
}: { children?: React.ReactNode; style?: any }) {
  return (
    <Text style={[styles.description, style]} {...props}>
      {children}
    </Text>
  );
}

function FormMessage({
  children,
  style,
  ...props
}: { children?: React.ReactNode; style?: any }) {
  const { error } = useFormField();
  if (!error && !children) return null;
  const body = error ? String(error?.message ?? "") : children;
  return (
    <Text style={[styles.message, style]} {...props}>
      {body}
    </Text>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};

const styles = StyleSheet.create({
  formItem: {
    marginVertical: 8,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  labelError: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  inputError: {
    borderColor: "red",
  },
  description: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  message: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
