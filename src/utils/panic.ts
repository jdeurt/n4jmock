export const panic = (message: string): never => {
    console.error(message);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
};
