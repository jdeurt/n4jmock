declare module "NodeJS" {
    interface Process {
        argv: (string | undefined)[];
    }
}
