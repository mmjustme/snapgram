import { useQueries, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createUserAccount, signInAccount } from '../appwrite/api'
import { INewUser } from '@/types'
// Main purpose lib are useQueries - fetching data, useMutation - modifing data, autocahsing data

// initialize new mutate fn and react-query know about createUserAccount fn
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => signInAccount(user)
    })
}