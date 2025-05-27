import { apiSlice } from "@/app/api/apiSlice";
import { RootState } from "@/app/store";
import { 
    createEntityAdapter, 
    createSelector, 
    EntityState 
} from "@reduxjs/toolkit";

type User = {
  id: number;
  user_name: string;
  user_email: string;
  role: string;
}

const usersAdapter = createEntityAdapter<User, number>({
    selectId: (user) => user.id,
  });

const initialState: EntityState<User, number> = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<EntityState<User, number>, void>({
      query: () => ({
        url: '/admin/get-all-users',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: User[]) => {
        return usersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              { type: 'User', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'User' as const, id })),
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),
    addNewUser: builder.mutation<User, Partial<User>>({
      query: (initialUserData) => ({
        url: '/admin/add-user',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: "LIST" }],
    }),
    // add other endpoints here
  }),
});

export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    // useUpdateUserMutation,
    // useDeleteUserMutation,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors<RootState>(state => selectUsersData(state) ?? initialState)