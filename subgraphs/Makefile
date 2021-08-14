BUILD_DIR ?= build
SUBGRAPHS_FILE ?= subgraphs.json
TEMPLATE_DIR ?= templates
SUBGRAPH_TEMPLATE_FILE ?= ${TEMPLATE_DIR}/subgraph.hbs
TEMPLATE_PARTIALS_DIR ?= ${TEMPLATE_DIR}/partials
SRC_DIR ?= src
ABI_DIR ?= abis
SCHEMA_FILE ?= schema.graphql

NETWORKS ?= $(shell jq .subgraphs subgraphs.json | jq -r 'keys[]')

SUBGRAPH_DIRS = $(addprefix ${BUILD_DIR}/, ${NETWORKS})


.DELETE_ON_ERROR:
.SECONDARY:


build: $(addprefix ${BUILD_DIR}/, $(addsuffix /build/.dirstamp, ${NETWORKS}))
codegen: $(addprefix ${BUILD_DIR}/, $(addsuffix /generated/.dirstamp, ${NETWORKS}))

${BUILD_DIR}/%/deployed: ${BUILD_DIR}/%/generated/.dirstamp ${BUILD_DIR}/%/subgraph.yaml ${BUILD_DIR}/%/schema.graphql
	cd $(dir $@) && graph deploy --product hosted-service --node https://api.thegraph.com/deploy/ jannikluhn/knockoffs-$*
	touch $@

${BUILD_DIR}/%/build/.dirstamp: ${BUILD_DIR}/%/generated/.dirstamp ${BUILD_DIR}/%/subgraph.yaml ${BUILD_DIR}/%/src/.dirstamp ${BUILD_DIR}/%/schema.graphql
	graph build -o $(dir $@) $(word 2,$^)
	touch $@

${BUILD_DIR}/%/generated/.dirstamp: ${BUILD_DIR}/%/subgraph.yaml ${BUILD_DIR}/%/schema.graphql ${BUILD_DIR}/%/src/.dirstamp ${BUILD_DIR}/%/abis/.dirstamp
	graph codegen -o $(dir $@) $<
	touch $@

${BUILD_DIR}/%/abis/.dirstamp: ${ABI_DIR}/* | ${BUILD_DIR}/%
	cp -r ${ABI_DIR} $(dir $@)
	touch $@

${BUILD_DIR}/%/src/.dirstamp: ${SRC_DIR}/* | ${BUILD_DIR}/%
	cp -r ${SRC_DIR} ${BUILD_DIR}/$*
	touch $@

${BUILD_DIR}/%/schema.graphql: ${SCHEMA_FILE} | ${BUILD_DIR}/%
	cp ${SCHEMA_FILE} $@

${BUILD_DIR}/%/subgraph.yaml: ${BUILD_DIR}/%/subgraph.json ${SUBGRAPH_TEMPLATE_FILE} ${TEMPLATE_PARTIALS_DIR}/*
	npx hbs --data $< ${SUBGRAPH_TEMPLATE_FILE} \
		-P ${TEMPLATE_PARTIALS_DIR}/*  \
		-e yaml  \
		-s  \
	> $@

${BUILD_DIR}/%/subgraph.json: ${SUBGRAPHS_FILE} | ${BUILD_DIR}/%
	jq .subgraphs.$* ${SUBGRAPHS_FILE} > $@

${SUBGRAPH_DIRS}: ${BUILD_DIR}/%: ${SUBGRAPHS_FILE}
	mkdir -p $@

clean:
	rm -rf ${BUILD_DIR}
