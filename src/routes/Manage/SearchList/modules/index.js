import { ArrayUtil } from 'lq-tool';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const SEARCHLIST_REQUEST = 'SEARCHLIST_REQUEST';
const SEARCHLIST_SUCCESS = 'SEARCHLIST_SUCCESS';
const SEARCHLIST_FAILURE = 'SEARCHLIST_FAILURE';
const SEARCHLIST_SEARCH_CHANGE = 'SEARCHLIST_SEARCH_CHANGE';
const SEARCHLIST_LOCK_REQUEST = 'SEARCHLIST_USERS_REQUEST';
const SEARCHLIST_LOCK_SUCCESS = 'SEARCHLIST_USERS_SUCCESS';
const SEARCHLIST_LOCK_FAILURE = 'SEARCHLIST_USERS_FAILURE';
const SEARCHLIST_ROW_SELECT = 'SEARCHLIST_ROW_SELECT';
const SEARCHLIST_ROW_CLEAR = 'SEARCHLIST_ROW_CLEAR';
const SEARCHLIST_TAB_CHANGE = 'SEARCHLIST_TAB_CHANGE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  loadUsers: (params) => ({
    types: [SEARCHLIST_REQUEST, SEARCHLIST_SUCCESS, SEARCHLIST_FAILURE],
    callAPI: () => fetch('/users', params),
    payload: params,
  }),
  changeSearch: createAction(SEARCHLIST_SEARCH_CHANGE, 'fields'),
  lockUser: (params) => ({
    types: [SEARCHLIST_LOCK_REQUEST, SEARCHLIST_LOCK_SUCCESS, SEARCHLIST_LOCK_FAILURE],
    callAPI: () => fetch('/users/lock', params),
    payload: params,
  }),
  selectRows: createAction(SEARCHLIST_ROW_SELECT, 'changedRows', 'selected'),
  clearSelectedKeys: createAction(SEARCHLIST_ROW_CLEAR),
  changeTab: createAction(SEARCHLIST_TAB_CHANGE, 'key'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SEARCHLIST_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [SEARCHLIST_SUCCESS]: (state, action) => ({
    ...state,
    users: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.total,
    },
    sorter: {
      columnKey: action.columnKey,
      order: action.order,
    },
  }),
  [SEARCHLIST_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [SEARCHLIST_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [SEARCHLIST_LOCK_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [SEARCHLIST_LOCK_SUCCESS]: (state, action) => {
    const users = state.users;
    const lockedUsers = action.data;
    lockedUsers.forEach((user) => {
      const index = users.findIndex((item) => item.id === user.id);
      users[index] = user;
    });
    return {
      ...state,
      loading: false,
      users,
      selectedRowKeys: action.multi ? [] : state.selectedRowKeys,
    };
  },
  [SEARCHLIST_LOCK_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [SEARCHLIST_ROW_SELECT]: (state, action) => {
    let selectedRowKeys = [];
    if (action.selected) {
      selectedRowKeys =
        Array.from(new Set(state.selectedRowKeys.concat(action.changedRows.map((item) => (item.id)))));
    } else {
      selectedRowKeys = ArrayUtil.dislodge(state.selectedRowKeys, action.changedRows.map((item) => (item.id)));
    }
    return {
      ...state,
      selectedRowKeys,
    };
  },
  [SEARCHLIST_ROW_CLEAR] : (state) => ({
    ...state,
    selectedRowKeys: [],
  }),
  [SEARCHLIST_TAB_CHANGE] : (state, action) => ({
    ...state,
    activeTab: action.key,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  users: [],
  searchParams: {},
  activeTab: '1',
  sorter: {
    columnKey: 'createDatetime',
    order: 'descend',
  },
  selectedRowKeys: [],
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
