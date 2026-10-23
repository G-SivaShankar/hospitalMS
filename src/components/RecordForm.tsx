"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Form,
  Button,
} from "antd";
import type { FieldConfig, FieldValue } from "../types/hospital";

type FormValues = Record<string, FieldValue>;

interface Props {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  initialValues?: FormValues;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
}

export default function RecordForm({
  open,
  title,
  fields,
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const schema = z.object(
    Object.fromEntries(
      fields.map((field) => {
        let validator: z.ZodTypeAny;

        if (field.type === "number") {
          validator = z.coerce.number().min(0, "Must be 0 or greater");
        } else if (field.type === "email") {
          validator = z.string().email("Enter a valid email");
        } else {
          validator = z.string().trim().min(1, `${field.label} is required`);
        }

        if (!field.required) {
          validator = validator.optional();
        }

        return [field.name, validator];
      }),
    ),
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: initialValues ?? {},
  });

  useEffect(() => {
    if (open) {
      reset(initialValues ?? {});
    }
  }, [open, initialValues, reset]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            validateStatus={errors[field.name] ? "error" : ""}
            help={errors[field.name]?.message as string | undefined}
            required={field.required}
          >
            {field.type === "select" ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: inputField }) => (
                  <Select
                    {...inputField}
                    className="full-width"
                    placeholder={`Select ${field.label}`}
                    options={(field.options ?? []).map((value) => ({
                      label: value,
                      value,
                    }))}
                  />
                )}
              />
            ) : field.type === "number" ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: inputField }) => (
                  <InputNumber
                    min={0}
                    className="full-width"
                    value={inputField.value as number | undefined}
                    onChange={inputField.onChange}
                    onBlur={inputField.onBlur}
                  />
                )}
              />
            ) : (
              <Controller
                name={field.name}
                control={control}
                render={({ field: inputField }) => (
                  <Input
                    ref={inputField.ref}
                    name={inputField.name}
                    value={inputField.value as string | undefined}
                    onChange={inputField.onChange}
                    onBlur={inputField.onBlur}
                    type={field.type}
                    placeholder={field.name === "bedNumber" ? "e.g. G-01" : `Enter ${field.label}`}
                  />
                )}
              />
            )}
          </Form.Item>
        ))}

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Save
        </Button>
      </form>
    </Modal>
  );
}