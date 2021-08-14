BUILD_DIR ?= build
SUBGRAPHS_FILE ?= subgraphs.json
TEMPLATE_DIR ?= templates
SUBGRAPH_TEMPLATE_FILE ?= ${TEMPLATE_DIR}/subgraph.hbs
TEMPLATE_PARTIALS_DIR ?= ${TEMPLATE_DIR}/partials
SRC_DIR ?= src
ABI_DIR ?= abis

NETWORKS ?= $(shell jq .subgraphs subgraphs.json | jq -r 'keys[]')

SUBGRAPH_JSON_FILES = $(addsuffix .json, $(addprefix ${BUILD_DIR}/subgraph-, ${NETWORKS}))
SUBGRAPH_YAML_FILES = $(addsuffix .yaml, $(addprefix ${BUILD_DIR}/subgraph-, ${NETWORKS}))

${BUILD_DIR}/build-%: ${BUILD_DIR}/generated-%
	graph build -o ${BUILD_DIR}/build-$* ${BUILD_DIR}/subgraph-$*.yaml


${BUILD_DIR}/generated-%: ${BUILD_DIR}/subgraph-%.yaml ${SRC_DIR}/* ${ABI_DIR}/*
	graph codegen -o ${BUILD_DIR}/generated-$* $<


subgraph-yaml: subgraph-json ${SUBGRAPH_YAML_FILES}


${BUILD_DIR}/subgraph-%.yaml: ${BUILD_DIR}/subgraph-%.json ${SUBGRAPH_TEMPLATE_FILE} ${TEMPLATE_PARTIALS_DIR}/*
	npx hbs --data $< ${SUBGRAPH_TEMPLATE_FILE} \
		-P ${TEMPLATE_PARTIALS_DIR}/*  \
		-e yaml  \
		-s  \
	> $@


subgraph-json: ${SUBGRAPH_JSON_FILES}


$(SUBGRAPH_JSON_FILES): ${BUILD_DIR}/subgraph-%.json: ${SUBGRAPHS_FILE} | ${BUILD_DIR}
	jq .subgraphs.$* ${SUBGRAPHS_FILE} > $@


${BUILD_DIR}:
	mkdir ${BUILD_DIR}

clean:
	rm -rf ${BUILD_DIR}
