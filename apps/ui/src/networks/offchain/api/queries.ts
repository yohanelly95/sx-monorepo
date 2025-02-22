import gql from 'graphql-tag';

const SPACE_FRAGMENT = gql`
  fragment spaceFragment on Space {
    id
    admins
    name
    network
    about
    website
    twitter
    github
    symbol
    treasuries {
      network
      address
    }
    delegationPortal {
      delegationType
      delegationContract
      delegationApi
    }
    voting {
      delay
      period
      quorum
    }
    strategies {
      name
      params
      network
    }
    proposalsCount
    votesCount
  }
`;

const PROPOSAL_FRAGMENT = gql`
  fragment proposalFragment on Proposal {
    id
    ipfs
    space {
      id
      name
      network
      admins
      symbol
    }
    type
    title
    body
    discussion
    author
    quorum
    start
    end
    snapshot
    choices
    scores
    scores_total
    state
    strategies {
      name
      params
      network
    }
    created
    updated
    votes
  }
`;

export const PROPOSAL_QUERY = gql`
  query ($id: String!) {
    proposal(id: $id) {
      ...proposalFragment
    }
  }
  ${PROPOSAL_FRAGMENT}
`;

export const PROPOSALS_QUERY = gql`
  query ($first: Int!, $skip: Int!, $where: ProposalWhere) {
    proposals(first: $first, skip: $skip, where: $where, orderBy: "created", orderDirection: desc) {
      ...proposalFragment
    }
  }
  ${PROPOSAL_FRAGMENT}
`;

export const SPACES_RANKING_QUERY = gql`
  query ($first: Int, $skip: Int, $where: SpaceWhere) {
    spaces(first: $first, skip: $skip, where: $where) {
      ...spaceFragment
    }
  }
  ${SPACE_FRAGMENT}
`;

export const SPACE_QUERY = gql`
  query ($id: String!) {
    space(id: $id) {
      ...spaceFragment
    }
  }
  ${SPACE_FRAGMENT}
`;

export const VOTES_QUERY = gql`
  query (
    $first: Int!
    $skip: Int!
    $orderBy: String!
    $orderDirection: OrderDirection!
    $where: VoteWhere
  ) {
    votes(
      first: $first
      skip: $skip
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      voter
      space {
        id
      }
      proposal {
        id
      }
      ipfs
      choice
      vp
      created
    }
  }
`;
