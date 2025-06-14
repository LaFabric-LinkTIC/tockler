import { Box, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import * as yup from 'yup';
import { RootContext } from '../../RootContext';
import { CardBox } from '../CardBox';
import { DataSettingsI } from './DataForm.util';

const schema = yup
    .object({
        idleAfterSeconds: yup.string().required().label('Idle after in Seconds'),
        backgroundJobInterval: yup.number().required().positive().integer().label('Session Length'),
        webhookRetryMinutes: yup.number().required().positive().integer().label('Webhook retry interval (minutes)'),
    })
    .required();

export const DataForm = () => {
    const { dataSettings, updateDataSettings } = useContext(RootContext);

    const {
        watch,
        reset,
        formState: { errors, isDirty, isValid },
        register,
    } = useForm<DataSettingsI>({ mode: 'onChange', defaultValues: dataSettings, resolver: yupResolver(schema) });

    const watchAllFields = watch();

    const debouncedUpdate = useDebouncedCallback(
        (value) => {
            console.info('Save values: ', value);
            updateDataSettings(value);
        },
        1000,
        { leading: false, trailing: true },
    );

    useEffect(() => {
        if (isDirty && isValid) {
            const formValues = watchAllFields;
            debouncedUpdate(formValues);
            reset(formValues);
        } else if (isDirty) {
            debouncedUpdate.cancel();
        }
    }, [watchAllFields, isDirty, isValid, debouncedUpdate, reset]);

    return (
        <CardBox title="Data settings" divider w="50%">
            <FormControl isInvalid={!!errors.backgroundJobInterval} pb={4}>
                <FormLabel htmlFor="backgroundJobInterval">Background job interval (in seconds)</FormLabel>
                <Input placeholder="Background job interval" {...register('backgroundJobInterval')} />
                <FormErrorMessage>
                    {errors.backgroundJobInterval && errors.backgroundJobInterval.message}
                </FormErrorMessage>
            </FormControl>
            <Box pt={0} pb={6}>
                <Text fontSize="sm" as="i">
                    Background job runs every 3 seconds by default. In there application checks active window title and
                    the state of system (idle, offline, online)
                </Text>
            </Box>

            <FormControl isInvalid={!!errors.webhookRetryMinutes} pb={4}>
                <FormLabel htmlFor="webhookRetryMinutes">Webhook retry interval (minutes)</FormLabel>
                <Input placeholder="Webhook retry interval" {...register('webhookRetryMinutes')} />
                <FormErrorMessage>
                    {errors.webhookRetryMinutes && errors.webhookRetryMinutes.message}
                </FormErrorMessage>
            </FormControl>

            <Box pt={0} pb={6}>
                <Text fontSize="sm" as="i">Interval between attempts to resend failed log webhooks.</Text>
            </Box>

            <FormControl isInvalid={!!errors.idleAfterSeconds} pb={4}>
                <FormLabel htmlFor="idleAfterSeconds">Idle after (in seconds)</FormLabel>
                <Input placeholder="Idle after" {...register('idleAfterSeconds')} />
                <FormErrorMessage>{errors.idleAfterSeconds && errors.idleAfterSeconds.message}</FormErrorMessage>
            </FormControl>

            <Box pt={0} pb={6}>
                <Text fontSize="sm" as="i">
                    Time when system adds "Idle" item to timeline.
                </Text>
            </Box>
        </CardBox>
    );
};
