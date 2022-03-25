import gql from 'graphql-tag';

export const PROPOSAL_QUERY = gql`
  query ($id: String!) {
    proposal(id: $id) {
      id
      proposal_id
      space
      author
      metadata_uri
      title
      body
      start
      end
      snapshot
      created
      tx
      vote_count
    }
  }
`;

export const PROPOSALS_QUERY = gql`
  query {
    proposals {
      id
      proposal_id
      space
      author
      metadata_uri
      title
      body
      start
      end
      snapshot
      created
      tx
      vote_count
    }
  }
`;

export const VOTES_QUERY = gql`
  query ($space: String!, $proposal: Int!) {
    votes(where: { space: $space, proposal: $proposal }) {
      id
      voter
      space
      proposal
      choice
      vp
      created
    }
  }
`;

export const SPACE_QUERY = gql`
  query ($id: String!) {
    space(id: $id) {
      id
      name
      voting_delay
      voting_period
      proposal_threshold
      proposal_count
      vote_count
    }
  }
`;

export const SPACES_QUERY = gql`
  query {
    spaces {
      id
      name
      proposal_count
      vote_count
    }
  }
`;
