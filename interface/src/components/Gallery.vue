<template>
  <div>
    <p>Gallery</p>
    <p>{{ recentKnockOffs }}</p>
    <button @click="fetchMore">Fetch More</button>
  </div>
</template>

<script>
import gql from "graphql-tag";

const pageSize = 2;

export default {
  name: "Gallery",

  data() {
    return {
      lastTimestamp: 0,
    };
  },

  apollo: {
    recentKnockOffs: {
      query: gql`
        query erc721KnockOffTokens($lastTimestamp: Int, $pageSize: Int) {
          erc721KnockOffTokens(
            orderBy: timestamp
            orderDirection: desc
            first: $pageSize
            where: { timestamp_gt: $lastTimestamp }
          ) {
            id
            tokenID
            serialNumber
            timestamp
          }
        }
      `,
      update: (data) => data.erc721KnockOffTokens,
      client: 5,
      variables: {
        lastTimestamp: 0,
        pageSize,
      },
    },
  },

  methods: {
    fetchMore() {
      this.lastTimestamp = this.recentKnockOffs[
        this.recentKnockOffs.length - 1
      ].timestamp;

      this.$apollo.queries.recentKnockOffs.fetchMore({
        variables: {
          lastTimestamp: this.lastTimestamp,
        },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            erc721KnockOffTokens: [
              ...previousResult.erc721KnockOffTokens,
              ...fetchMoreResult.erc721KnockOffTokens,
            ],
          };
        },
      });
    },
  },
};
</script>
